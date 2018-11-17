"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_repository_1 = require("../model/user.repository");
var api_1 = require("../core/api");
var login_controller_1 = require("./login.controller");
var SocketController = /** @class */ (function () {
    function SocketController() {
    }
    SocketController.routes = function (io) {
        var _this = this;
        io.on('connection', function (socket) {
            //Router.clients.set(SocketUtility.getCookie(socket), socket);
            console.log('New user connected with ID: ' + SocketUtility.getCookie(socket));
            socket.on('disconnect', function () { return login_controller_1.LoginController.onDisconnect(socket); });
            socket.on(api_1.Api.GUEST_LOGIN_REQUEST_ID, function () { return login_controller_1.LoginController.guestLogin(socket); });
            socket.on(api_1.Api.NEW_MESSAGE_ID, function (message) { return _this.onNewMessage(message); });
        });
    };
    SocketController.onNewMessage = function (remoteMessage) {
        var target = user_repository_1.UserRepository.get(remoteMessage.target.id).socket;
        if (target) {
            console.log('UserConnection with ID: ' + remoteMessage.target.id + ' has send message to user' + remoteMessage.target.id + ': ' + remoteMessage.body);
            target.emit(api_1.Api.NEW_MESSAGE_ID, remoteMessage);
        }
        else {
            // wrong request or user has been disconnected
        }
    };
    return SocketController;
}());
exports.SocketController = SocketController;
//# sourceMappingURL=socket.controller.js.map