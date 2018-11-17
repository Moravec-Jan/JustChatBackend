import {Router, Request, Response} from 'express';
import {UserEntity} from '../model/user-entity';
import {LoggedData} from '../model/logged-data';
import {NameGenerator} from '../model/name-generator';
import {UserSessionRepository} from '../model/user-session.repository';
import {Api} from '../core/api';
import {Socket} from 'socket.io';
import {UserConnection} from '../model/user-connection';
import {RegistrationData} from '../model/registration-data';
import {UserDataRepository} from '../model/user-data.repository';
import {UserData} from '../model/user-data';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';
import * as uniqid from 'uniqid';
import {SocketUtility} from '../util/socket.utility';

// noinspection ES6ConvertVarToLetConst


export class LoginController {
    private static saltRounds: number = 12;

    public static register(socket: Socket, data: RegistrationData) {
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
                const user: UserConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(socket));
                const userEntity: UserEntity = {name: data.nickname, id: user.user.id};
                UserDataRepository.add({id: userEntity.id, nickname: data.nickname, email: data.email, password: hash}); // store hash
                this.updateUserConnection(socket, userEntity);
                const info = this.createSuccessfulInfo(socket, data);
                socket.emit(Api.REGISTER_REQUEST_ID, info); // to sender
                socket.broadcast.emit(Api.OTHER_USER_LOGGED_IN_ID, userEntity);
            }
        });
    }

    private static createSuccessfulInfo(socket: Socket, data) {
        const userConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(socket));
        let users: UserEntity[] = UserSessionRepository.getAllUsersExcept(userConnection.user.id);
        return {name: data.nickname, users, status: 'success'};
    }


    private static sendServerError(socket: Socket, err) {
        socket.emit(Api.REGISTER_REQUEST_ID, {status: 'error', error: 'Server error has occurred!'});
        console.log(err);
    }

    public static guestLogin = (socket: Socket) => {
        // try to find session if does not exist create new guest
        const connection = UserSessionRepository.getBySessionId(socket.handshake.headers.cookie);
        const user: UserEntity = connection ? connection.user : LoginController.generateGuestData();
        const users: UserEntity[] = UserSessionRepository.getAllUsersExcept(user.id);
        const info: LoggedData = {id: user.id, name: user.name, users, status: 'success'};
        socket.broadcast.emit(Api.OTHER_USER_LOGGED_IN_ID, user); //receive all except sender

        if (!connection) {
            //for new users
            UserSessionRepository.add(SocketUtility.getCookie(socket), new UserConnection(socket, user));
            socket.emit(Api.GUEST_LOGIN_REQUEST_ID, info); // logged as guest
        } else {
            // for earlier logged
            if (UserDataRepository.getById(connection.user.id)) {
                socket.emit(Api.USER_LOGIN_REQUEST_ID, info); //user
            } else {
                socket.emit(Api.GUEST_LOGIN_REQUEST_ID, info); //guest
            }
        }
    };

    private static generateGuestData(): UserEntity {
        const id: string = uniqid();
        const name: string = NameGenerator.generateName();
        return {id, name};
    }

    public static userLogin = (socket: Socket, data) => {
        const userData: UserData = UserDataRepository.get(data.email);
        if (userData) {
            bcrypt.compare(data.password, userData.password, (err, res) => {
                if (res) { //right password
                    const userData = UserDataRepository.get(data.email);
                    const userEntity: UserEntity = {name: userData.nickname, id: userData.id};
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
        let userConnection: UserConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(socket));
        if (!userConnection) {
            userConnection = new UserConnection(socket, userEntity); // create new
            UserSessionRepository.add(SocketUtility.getCookie(socket), userConnection);
        } else {
            userConnection.user = userEntity; // set new name
        }
    }

    public static onDisconnect(socket: Socket) {
        console.log('UserConnection with ID: ' + SocketUtility.getCookie(socket) + ' has been disconnected');
        const userConnection: UserConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(socket));
        if (userConnection) {
            //UserSessionRepository.remove(SocketUtility.getCookie(socket));
            socket.broadcast.emit(Api.OTHER_USER_LOGGED_OUT_ID, {id: userConnection.user.id}); //receive all except sender
        }
    }

    public static logout(socket: Socket) {
        const userConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(socket));
        UserSessionRepository.remove(SocketUtility.getCookie(socket));
        if (userConnection) {
            socket.broadcast.emit(Api.OTHER_USER_LOGGED_OUT_ID, {id: userConnection.user.id}); //notify others
            socket.emit(Api.LOGOUT_REQUEST_ID); //notify user
        }
    }

    private static validateUserData(data: RegistrationData): string {

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

