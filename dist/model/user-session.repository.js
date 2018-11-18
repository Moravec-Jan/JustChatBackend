"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_connection_1 = require("./user-connection");
var UserSessionRepository = /** @class */ (function () {
    function UserSessionRepository() {
    }
    UserSessionRepository.add = function (key, user) {
        this.activeSessions.set(key, user);
        this.userIdToSessionIdMap.set(user.user.id, key);
    };
    UserSessionRepository.getBySessionId = function (key) {
        var session = this.activeSessions.get(key);
        if (session) {
            return session;
        }
        else {
            return this.getFromArchiveBySessionId(key);
        }
    };
    UserSessionRepository.getFromArchiveBySessionId = function (key) {
        return this.archivedSessions.get(key);
    };
    UserSessionRepository.getByUserId = function (id) {
        var sessionId = this.userIdToSessionIdMap.get(id);
        if (sessionId) {
            return this.getBySessionId(sessionId);
        }
    };
    UserSessionRepository.remove = function (key) {
        var userConnection = this.activeSessions.get(key);
        if (userConnection) {
            this.userIdToSessionIdMap.delete(userConnection.user.id);
            this.activeSessions.delete(key);
        }
    };
    UserSessionRepository.update = function (id, socket, entity) {
        this.remove(id);
        this.add(id, new user_connection_1.UserConnection(socket, entity));
    };
    UserSessionRepository.getAllUsers = function () {
        return Array.from(this.activeSessions.values(), function (v) { return v.user; });
    };
    UserSessionRepository.getAllUsersExcept = function (userId) {
        return Array.from(this.activeSessions.values(), function (v) { return v.user; })
            .filter(function (value) { return value.id !== userId; });
    };
    UserSessionRepository.moveToArchive = function (key) {
        var user = UserSessionRepository.getBySessionId(key);
        if (user) {
            UserSessionRepository.remove(key);
            UserSessionRepository.archivedSessions.set(key, user);
        }
    };
    UserSessionRepository.moveToActive = function (key) {
        var user = UserSessionRepository.getFromArchiveBySessionId(key);
        if (user) {
            this.archivedSessions.delete(key);
            UserSessionRepository.add(key, user);
        }
    };
    UserSessionRepository.activeSessions = new Map();
    UserSessionRepository.archivedSessions = new Map();
    UserSessionRepository.userIdToSessionIdMap = new Map();
    return UserSessionRepository;
}());
exports.UserSessionRepository = UserSessionRepository;
//# sourceMappingURL=user-session.repository.js.map