import {Socket} from 'socket.io';
import {NameGenerator} from './name-generator';

export class SocketController {
    public static readonly NEW_MESSAGE_ID = 'new_message';
    public static readonly LOGIN_REQUEST_ID = 'login';
    public static readonly USER_LOGGED_IN_ID = 'user_logged_in';
    public static readonly USER_LOGGED_OUT_ID = 'user_logged_out';
    private static clients: Map<string, Socket> = new Map();

    public static routes(io) {
        io.on('connection', (socket) => {
            SocketController.clients.set(socket.id, socket);
            console.log('New user connected with ID: ' + socket.id);

            socket.on('disconnect', () => {
                console.log('User with ID: ' + socket.id + ' has been disconnected');
                SocketController.clients.delete(socket.id);
                socket.broadcast.emit(this.USER_LOGGED_OUT_ID, {id: socket.id}); //receives all except sender
            });

            socket.on(this.LOGIN_REQUEST_ID, () => {
                console.log('User with ID: ' + socket.id + 'trying to log in.');
                const name: string = NameGenerator.generateName();
                socket['username'] = name; // dynamic injected attribute

                let users: {}[] = [];
                this.clients.forEach((value: Socket) => {
                    if (socket.id !== value.id) {
                        users.push({name: value['username'], id: value.id});
                    }
                });

                socket.emit(this.LOGIN_REQUEST_ID, {name: name, users: users});
                socket.broadcast.emit(this.USER_LOGGED_IN_ID, {name: name, id: socket.id}); //receives all except sender

            });

            socket.on(this.NEW_MESSAGE_ID, (remoteMessage) => {
                const target: Socket = this.clients.get(remoteMessage.target.id);
                if (target) {
                    console.log('User with ID: ' + remoteMessage.target.id + ' has send message to user' + remoteMessage.author.id + ': ' + remoteMessage.body);
                    target.emit(this.NEW_MESSAGE_ID, remoteMessage);
                } else {
                    // wrong request or user has been disconnected
                }
            });
        });
    }
}
