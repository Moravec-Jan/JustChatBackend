import {Socket} from 'socket.io';
import * as CookieParser from 'cookie';

export class SocketUtility {

    public static getCookie(socket: Socket) {
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