import {Api} from './api';
import {LoginController} from '../controller/login.controller';
import {MessageController} from '../controller/message.controller';
import {RegistrationData} from '../model/registration-data';

export class Router {
    public static routes(io) {
        io.on('connection', (socket) => {
            console.log('New user connected with ID: ' + socket.id);
            socket.on('disconnect', () => LoginController.onDisconnect(socket));
            socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.guestLogin(socket));
            socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
            socket.on(Api.REGISTER_REQUEST_ID, (data: RegistrationData) => LoginController.register(socket, data));
            socket.on(Api.USER_LOGIN_REQUEST_ID, (data: RegistrationData) => LoginController.userLogin(socket, data));
        });
    }
}
