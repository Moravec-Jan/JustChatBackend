import {Socket} from 'socket.io';
import {User} from './user';

export class UserConnection {
    private _socket: Socket;
    private _user: User;

    constructor(socket: Socket, user: User) {
        this._socket = socket;
        this._user = user;
    }

    get socket(): Socket {
        return this._socket;
    }

    get user(): User {
        return this._user;
    }

    set socket(value: SocketIO.Socket) {
        this._socket = value;
    }

    set user(value: User) {
        this._user = value;
    }
}