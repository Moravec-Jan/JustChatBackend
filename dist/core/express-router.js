"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressRouter = /** @class */ (function () {
    function ExpressRouter() {
    }
    ExpressRouter.route = function (app) {
        // app.getBySessionId('/', (req, res) => {
        //     console.log(req);
        //     res.sendfile(path.join(__dirname, '../../public'));
        // });
        // app.post(Api.REGISTER_REQUEST_ID, (req,res) => LoginController.register(req,res));
        // socket.on(Api.GUEST_LOGIN_REQUEST_ID, () => LoginController.connectUser(socket));
        // socket.on(Api.NEW_MESSAGE_ID, (message) => MessageController.onNewMessage(socket, message));
        // socket.on(Api.REGISTER_REQUEST_ID, (data: RegistrationData) => LoginController.register(socket, data));
        // socket.on(Api.USER_LOGIN_REQUEST_ID, (data: RegistrationData) => LoginController.userLogin(socket, data));
    };
    return ExpressRouter;
}());
exports.ExpressRouter = ExpressRouter;
//# sourceMappingURL=express-router.js.map