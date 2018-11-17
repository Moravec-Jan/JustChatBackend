"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CookieParser = require("cookie");
var SocketUtility = /** @class */ (function () {
    function SocketUtility() {
    }
    SocketUtility.getSessionId = function (socket) {
        if (!socket.handshake.headers.cookie) {
            return false;
        }
        var cookies = CookieParser.parse(socket.handshake.headers.cookie);
        if (!cookies) {
            return false;
        }
        if (!cookies['connect.sid']) {
            return false;
        }
        return cookies['connect.sid'];
    };
    return SocketUtility;
}());
exports.SocketUtility = SocketUtility;
//# sourceMappingURL=socket.utility.js.map