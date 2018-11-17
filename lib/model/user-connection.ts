import {Socket} from 'socket.io';
import {UserEntity} from './user-entity';

export class UserConnection {
    private readonly _socket: Socket;
    private readonly _user: UserEntity;


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
}