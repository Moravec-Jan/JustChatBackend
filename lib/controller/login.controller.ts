import {Router, Request, Response} from 'express';
import {User} from '../model/user';
import {LoggedData} from '../model/logged-data';
import {NameGenerator} from '../model/name-generator';
import {UserRepository} from '../model/user.repository';
import {Api} from '../core/api';
import {Socket} from 'socket.io';
import {UserConnection} from '../model/user-connection';


export class LoginController {


    public static guestLogin = (socket: Socket) => {
        const id: string = socket.id;
        const name: string = NameGenerator.generateName();
        const user: User = {id, name};
        const users: User[] = UserRepository.getAllUsers();
        const info: LoggedData = {name, users};

        UserRepository.add(socket.id, new UserConnection(socket, user));
        socket.emit(Api.LOGIN_SUCCESS_ID, info); // to sender
        socket.broadcast.emit(Api.USER_LOGGED_IN_ID, {name: name, id: socket.id}); //receives all except sender
    };

    public static onDisconnect(socket) {
        console.log('UserConnection with ID: ' + socket.id + ' has been disconnected');
        UserRepository.remove(socket.id);
        socket.broadcast.emit(Api.USER_LOGGED_OUT_ID, {id: socket.id}); //receives all except sender
    }
}

