"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRouter = /** @class */ (function () {
    function HttpRouter() {
    }
    HttpRouter.route = function (app) {
        app.get('/', function (req, res) {
            console.log(req);
        });
        // app.post(Api.REGISTER_REQUEST_ID, (req,res) => LoginController.register(req,res));
        // socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.guestLogin(socket));
        // socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
        // socket.on(Api.REGISTER_REQUEST_ID, (data: RegistrationData) => LoginController.register(socket, data));
        // socket.on(Api.USER_LOGIN_REQUEST_ID, (data: RegistrationData) => LoginController.userLogin(socket, data));
    };
    return HttpRouter;
}());
exports.HttpRouter = HttpRouter;
//# sourceMappingURL=http-router.js.map