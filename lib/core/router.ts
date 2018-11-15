import {Api} from './api';
import {LoginController} from '../controller/login.controller';
import {MessageController} from '../controller/message.controller';

export class Router {
    public static routes(io) {
        try {
            io.on('connection', (socket) => {
                console.log('New user connected with ID: ' + socket.id);
                socket.on('disconnect', () => LoginController.onDisconnect(socket));
                socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.guestLogin(socket));
                socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
            });
        } catch (e) {
            console.error(e);
        }
    }
}
