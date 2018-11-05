"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketController = /** @class */ (function () {
    function SocketController() {
    }
    SocketController.routes = function (io) {
        io.on('connection', function (socket) {
            SocketController.clients.push(socket);
            console.log('a user connected');
            // @ts-ignore
            var res = SocketController.clients.find(function (soc) { return soc.id === socket.id; });
            res.emit("message", "hello");
        });
    };
    SocketController.clients = []; // better would be hashmap
    return SocketController;
}());
exports.SocketController = SocketController;
//# sourceMappingURL=socket_controller.js.map