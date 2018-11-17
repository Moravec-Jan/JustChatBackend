"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var login_controller_1 = require("../controller/login.controller");
var message_controller_1 = require("../controller/message.controller");
var socket_utility_1 = require("../util/socket.utility");
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.routes = function (io) {
        io.use(function (socket, next) {
            if (!socket_utility_1.SocketUtility.getCookie(socket)) {
                console.log('unauthorized access' + socket);
                //TODO: unauthorized access
                return;
            }
            next();
        });
        io.on('connection', function (socket) {
            console.log('New user connected with ID: ' + socket_utility_1.SocketUtility.getCookie(socket));
            socket.on('disconnect', function () { return login_controller_1.LoginController.onDisconnect(socket); });
            socket.on(api_1.Api.GUEST_LOGIN_REQUEST_ID, function () { return login_controller_1.LoginController.guestLogin(socket); });
            socket.on(api_1.Api.NEW_MESSAGE_ID, function (message) { return message_controller_1.MessageController.onNewMessage(socket, message); });
            socket.on(api_1.Api.REGISTER_REQUEST_ID, function (data) { return login_controller_1.LoginController.register(socket, data); });
            socket.on(api_1.Api.USER_LOGIN_REQUEST_ID, function (data) { return login_controller_1.LoginController.userLogin(socket, data); });
            socket.on(api_1.Api.LOGOUT_REQUEST_ID, function () { return login_controller_1.LoginController.logout(socket); });
        });
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map