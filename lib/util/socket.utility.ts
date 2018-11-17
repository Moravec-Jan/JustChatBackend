import {Socket} from 'socket.io';
import * as CookieParser from 'cookie';

export class SocketUtility {

    public static getSessionId(socket: Socket) {
        if (!socket.handshake.headers.cookie) {
            return false;
        }
        const cookies = CookieParser.parse(socket.handshake.headers.cookie);
        if (!cookies) {
            return false;
        }

        if (!cookies['connect.sid']) {
            return false;
        }
        return cookies['connect.sid'];
    }

}