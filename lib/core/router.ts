import {Api} from './api';
import {LoginController} from '../controller/login.controller';
import {MessageController} from '../controller/message.controller';
import {RegistrationData} from '../model/registration-data';

export class Router {
    public static routes(io) {
        io.on('connection', (socket) => {
            console.log('New user connected with ID: ' + socket.handshake.query.ssid);
            socket.on('disconnect', () => LoginController.onDisconnect(socket));
            socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.guestLogin(socket));
            socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
            socket.on(Api.REGISTER_REQUEST_ID, (data: RegistrationData) => LoginController.register(socket, data));
            socket.on(Api.USER_LOGIN_REQUEST_ID, (data: RegistrationData) => LoginController.userLogin(socket, data));
            socket.on(Api.LOGOUT_REQUEST_ID, () => LoginController.logout(socket))
        });

        io.use(function (socket, next) {
            if (!socket.handshake.query.ssid) {
                console.log("unauthorized access" + socket);
                //TODO: unauthorized access
                return;
            }
            next();
        });
    }
}
