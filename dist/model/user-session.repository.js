"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserSessionRepository = /** @class */ (function () {
    function UserSessionRepository() {
    }
    UserSessionRepository.add = function (key, user) {
        this.users.set(key, user);
        this.userIdToSessionIdMap.set(user.user.id, key);
    };
    UserSessionRepository.getBySessionId = function (key) {
        return this.users.get(key);
    };
    UserSessionRepository.getByUserId = function (id) {
        var sessionId = this.userIdToSessionIdMap.get(id);
        if (sessionId) {
            return this.getBySessionId(sessionId);
        }
    };
    UserSessionRepository.remove = function (key) {
        var userConnection = this.users.get(key);
        if (userConnection) {
            this.userIdToSessionIdMap.delete(userConnection.user.id);
            this.users.delete(key);
        }
    };
    UserSessionRepository.getAllUsers = function () {
        return Array.from(this.users.values(), function (v) { return v.user; });
    };
    UserSessionRepository.getAllUsersExcept = function (userId) {
        return Array.from(this.users.values(), function (v) { return v.user; })
            .filter(function (value) { return value.id !== userId; });
    };
    UserSessionRepository.users = new Map();
    UserSessionRepository.userIdToSessionIdMap = new Map();
    return UserSessionRepository;
}());
exports.UserSessionRepository = UserSessionRepository;
//# sourceMappingURL=user-session.repository.js.map