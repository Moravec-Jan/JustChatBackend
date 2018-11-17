"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_session_repository_1 = require("../model/user-session.repository");
var api_1 = require("../core/api");
var socket_utility_1 = require("../util/socket.utility");
var MessageController = /** @class */ (function () {
    function MessageController() {
    }
    MessageController.onNewMessage = function (sender, message) {
        var author = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(sender)); // author is based on session, so it cannot be faked so easily
        if (!author) {
            console.log('author of message not found: ' + sender);
            return;
        }
        var remoteMessage = { author: author.user, target: message.target, id: message.id, body: message.body };
        var target = user_session_repository_1.UserSessionRepository.getByUserId(remoteMessage.target.id);
        if (target) {
            console.log('UserConnection with ID: ' + remoteMessage.target.id + ' has send message to user' + remoteMessage.author.id + ': ' + remoteMessage.body);
            target.socket.emit(api_1.Api.NEW_MESSAGE_ID, remoteMessage, function (data) {
                var info = { target: remoteMessage.target.id, id: remoteMessage.id, state: 'success' };
                sender.emit(api_1.Api.MESSAGE_INFO_ID, info);
            });
        }
        else {
            // something went wrong
            var info = { target: remoteMessage.target.id, id: remoteMessage.id, state: 'failure' };
            sender.emit(api_1.Api.MESSAGE_INFO_ID, info);
        }
    };
    return MessageController;
}());
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map