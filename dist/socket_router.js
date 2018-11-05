"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketController = /** @class */ (function () {
    function SocketController() {
    }
    SocketController.routes = function (io) {
        io.on('connection', function (socket) {
            console.log('a user connected');
            io.emit();
            io.sockets.find(socket.id);
        });
    };
    return SocketController;
}());
exports.SocketController = SocketController;
//# sourceMappingURL=socket_router.js.map