"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CookieParser = require("cookie");
var SocketUtility = /** @class */ (function () {
    function SocketUtility() {
    }
    SocketUtility.getCookie = function (socket) {
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