"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserConnection = /** @class */ (function () {
    function UserConnection(socket, user) {
        this._socket = socket;
        this._user = user;
    }
    Object.defineProperty(UserConnection.prototype, "socket", {
        get: function () {
            return this._socket;
        },
        set: function (value) {
            this._socket = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserConnection.prototype, "user", {
        get: function () {
            return this._user;
        },
        set: function (value) {
            this._user = value;
        },
        enumerable: true,
        configurable: true
    });
    return UserConnection;
}());
exports.UserConnection = UserConnection;
//# sourceMappingURL=user-connection.js.map