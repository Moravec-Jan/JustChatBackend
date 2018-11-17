"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserConnectionRepository = /** @class */ (function () {
    function UserConnectionRepository() {
    }
    UserConnectionRepository.add = function (key, user) {
        this.users.set(key, user);
        this.userIdToSessionIdMap.set(user.user.id, key);
    };
    UserConnectionRepository.getBySessionId = function (key) {
        return this.users.get(key);
    };
    UserConnectionRepository.getByUserId = function (id) {
        var sessionId = this.userIdToSessionIdMap.get(id);
        if (sessionId) {
            return this.getBySessionId(sessionId);
        }
    };
    UserConnectionRepository.remove = function (key) {
        var userConnection = this.users.get(key);
        if (userConnection) {
            this.userIdToSessionIdMap.delete(userConnection.user.id);
            this.users.delete(key);
        }
    };
    UserConnectionRepository.getAllUsers = function () {
        return Array.from(this.users.values(), function (v) { return v.user; });
    };
    UserConnectionRepository.users = new Map();
    UserConnectionRepository.userIdToSessionIdMap = new Map();
    return UserConnectionRepository;
}());
exports.UserConnectionRepository = UserConnectionRepository;
//# sourceMappingURL=user-connection.repository.js.map