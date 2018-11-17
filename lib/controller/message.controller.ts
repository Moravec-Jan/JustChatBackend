import {Socket} from 'socket.io';
import {UserSessionRepository} from '../model/user-session.repository';
import {Api} from '../core/api';
import {RemoteMessage} from '../model/remote-message';
import {MessageInfo} from '../model/message-info';
import {UserConnection} from '../model/user-connection';
import {SocketUtility} from '../util/socket.utility';

export class MessageController {
    public static onNewMessage(sender: Socket, message) {
        const author: UserConnection = UserSessionRepository.getBySessionId(SocketUtility.getCookie(sender)); // author is based on session, so it cannot be faked so easily
        const remoteMessage: RemoteMessage = {author: author.user, target: message.target, id: message.id, body: message.body};

        const target: UserConnection = UserSessionRepository.getByUserId(remoteMessage.target.id);
        if (target) {
            console.log('UserConnection with ID: ' + remoteMessage.target.id + ' has send message to user' + remoteMessage.author.id + ': ' + remoteMessage.body);
            target.socket.emit(Api.NEW_MESSAGE_ID, remoteMessage, (data) => { // verify that message has got to destination, has to been called from target
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