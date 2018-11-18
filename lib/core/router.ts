import {Api} from './api';
import {LoginController} from '../controller/login.controller';
import {MessageController} from '../controller/message.controller';
import {RegistrationData} from '../model/registration-data';
import {SocketUtility} from '../util/socket.utility';

export class Router {
    public static routes(io) {

        io.use(function (socket, next) { //middleware for checking session messageId
            if (!SocketUtility.getSessionId(socket)) {
                console.log('unauthorized access' + socket);
                //TODO: unauthorized access
                return;
            }
            next();
        });

        io.on('connection', (socket) => {
            console.log('New user connected');
            LoginController.connectUser(socket); // on connect log user based on session
            socket.on('disconnect', () => LoginController.onDisconnect(socket));
            socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.connectUser(socket));
            socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
            socket.on(Api.REGISTER_REQUEST_ID, (data: RegistrationData) => LoginController.register(socket, data));
            socket.on(Api.USER_LOGIN_REQUEST_ID, (data: RegistrationData) => LoginController.userLogin(socket, data));
            socket.on(Api.LOGOUT_REQUEST_ID, () => LoginController.logout(socket));
        });
    }
}
