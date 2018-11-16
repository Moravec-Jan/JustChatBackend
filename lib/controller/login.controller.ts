import {Router, Request, Response} from 'express';
import {UserEntity} from '../model/user-entity';
import {LoggedData} from '../model/logged-data';
import {NameGenerator} from '../model/name-generator';
import {UserConnectionRepository} from '../model/user-connection.repository';
import {Api} from '../core/api';
import {Socket} from 'socket.io';
import {UserConnection} from '../model/user-connection';
import {RegistrationData} from '../model/registration-data';
import {UserDataRepository} from '../model/user-data.repository';
import {UserData} from '../model/user-data';
import * as bcrypt from 'bcrypt';
import {strictEqual} from 'assert';
import * as validator from 'validator';

// noinspection ES6ConvertVarToLetConst


export class LoginController {
    private static saltRounds: number = 12;

    public static register(socket: Socket, data: UserData) {
        //validate data
        const error: string = LoginController.validateUserData(data);
        if (error !== '') {
            socket.emit(Api.REGISTER_REQUEST_ID, {status: 'error', error}); // to sender
            return;
        }

        //check email existence
        if (UserDataRepository.exists(data.email)) {
            socket.emit(Api.REGISTER_REQUEST_ID, {status: 'error', error: 'Email address has already been used.'}); // to sender
            return;
        }

        //lets store user data and send messages
        bcrypt.hash(data.password, this.saltRounds, (err, hash: string) => {
            if (err) {
                this.sendServerError(socket, err);
            } else {
                const userEntity = {name: data.nickname, id: socket.id};
                UserDataRepository.add({nickname: data.nickname, email: data.email, password: hash}); // store hash
                this.updateUserConnection(socket, userEntity);
                const info = this.createSuccessfulInfo(socket, data);
                socket.emit(Api.REGISTER_REQUEST_ID, info); // to sender
                socket.broadcast.emit(Api.OTHER_USER_LOGGED_IN_ID, userEntity);
            }
        });
    }

    private static createSuccessfulInfo(socket: SocketIO.Socket, data: UserData) {
        let users: UserEntity[] = UserConnectionRepository.getAllUsers();
        users = users.filter(value => value.id != socket.id);
        return {name: data.nickname, users, status: 'success'};
    }

    private static sendServerError(socket: Socket, err) {
        socket.emit(Api.REGISTER_REQUEST_ID, {status: 'error', error: 'Server error has occurred!'});
        console.log(err);
    }

    public static guestLogin = (socket: Socket) => {
        const id: string = socket.id;
        const name: string = NameGenerator.generateName();
        const user: UserEntity = {id, name};
        const users: UserEntity[] = UserConnectionRepository.getAllUsers();
        const info: LoggedData = {name, users, status: 'success'};

        UserConnectionRepository.add(socket.id, new UserConnection(socket, user));
        socket.emit(Api.GUEST_LOGIN_REQUEST_ID, info); // to sender
        socket.broadcast.emit(Api.OTHER_USER_LOGGED_IN_ID, {name: name, id: socket.id}); //receive all except sender
    };

    public static userLogin = (socket: Socket, data) => {
        const userData: UserData = UserDataRepository.get(data.email);
        if (userData) {
            bcrypt.compare(data.password, userData.password, (err, res) => {
                if (res) { //right password
                    const userData = UserDataRepository.get(data.email);
                    const userEntity: UserEntity = {name: userData.nickname, id: socket.id};
                    LoginController.updateUserConnection(socket, userEntity);
                    const info = LoginController.createSuccessfulInfo(socket, userData);
                    socket.emit(Api.USER_LOGIN_REQUEST_ID, info); // to sender
                    socket.broadcast.emit(Api.OTHER_USER_LOGGED_IN_ID, userEntity);
                } else {
                    socket.emit(Api.USER_LOGIN_REQUEST_ID, {status: 'error', error: 'Wrong email and password combination.'});
                }
            });
        } else {
            socket.emit(Api.USER_LOGIN_REQUEST_ID, {status: 'error', error: 'Wrong email and password combination.'});
        }
    };

    private static updateUserConnection(socket: Socket, userEntity) {
        let userConnection: UserConnection = UserConnectionRepository.get(socket.id);
        if (!userConnection) {
            userConnection = new UserConnection(socket, userEntity); // create new
            UserConnectionRepository.add(socket.id, userConnection);
        } else {
            userConnection.user = userEntity; // set new name
        }
    }

    public static onDisconnect(socket) {
        console.log('UserConnection with ID: ' + socket.id + ' has been disconnected');
        UserConnectionRepository.remove(socket.id);
        socket.broadcast.emit(Api.OTHER_USER_LOGGED_OUT_ID, {id: socket.id}); //receive all except sender
    }

    private static validateUserData(data: UserData): string {

        let error: string = '';
        if (!data || !data.password || !data.nickname || !data.email) {
            return 'All parameters must be filled up!';
        }

        if (!validator.isEmail(data.email)) {
            error += 'Invalid email! \n';
        }

        if (typeof data.password !== 'string' || !validator.isLength(data.password, {min: 8, max: 100})) {
            error += 'Password must be between 8-100 characters!\n';
        }

        if (typeof data.password !== 'string' || !validator.isLength(data.nickname, {min: 4, max: 100})) {
            error += 'Nickname must be between 4-20 characters!\n';
        }

        return error;
    }
}

