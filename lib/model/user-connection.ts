import {Socket} from 'socket.io';
import {UserEntity} from './user-entity';

export class UserConnection {
    private _socket: Socket;
    private _user: UserEntity;

    constructor(socket: Socket, user: UserEntity) {
        this._socket = socket;
        this._user = user;
    }

    get socket(): Socket {
        return this._socket;
    }

    get user(): UserEntity {
        return this._user;
    }

    set socket(value: SocketIO.Socket) {
        this._socket = value;
    }

    set user(value: UserEntity) {
        this._user = value;
    }
}