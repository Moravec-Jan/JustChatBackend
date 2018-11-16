import {Socket} from 'socket.io';
import {UserConnectionRepository} from '../model/user-connection.repository';
import {Api} from '../core/api';
import {RemoteMessage} from '../model/remote-message';
import {MessageInfo} from '../model/message-info';
import {UserConnection} from '../model/user-connection';

export class MessageController {
    public static onNewMessage(sender: Socket, remoteMessage: RemoteMessage) {
        const target: UserConnection = UserConnectionRepository.get(remoteMessage.target.id);
        if (target) {
            console.log('UserConnection with ID: ' + remoteMessage.target.id + ' has send message to user' + remoteMessage.author.id + ': ' + remoteMessage.body);
            target.socket.emit(Api.NEW_MESSAGE_ID, remoteMessage, (data) => { // verify that message has got to destination
                const info: MessageInfo = {target: remoteMessage.target.id, id: remoteMessage.id, state: 'success'};
                sender.emit(Api.MESSAGE_INFO_ID, info);
            });
        } else {
            // something went wrong
            const info: MessageInfo = {target: remoteMessage.target.id, id: remoteMessage.id, state: 'failure'};
            sender.emit(Api.MESSAGE_INFO_ID, info);
        }
    }
}