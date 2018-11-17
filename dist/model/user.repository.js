"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserRepository = /** @class */ (function () {
    function UserRepository() {
    }
    UserRepository.add = function (key, user) {
        this.users.set(key, user);
    };
    UserRepository.get = function (key) {
        return this.users.get(key);
    };
    UserRepository.remove = function (key) {
        this.users.delete(key);
    };
    UserRepository.getAllUsers = function () {
        return Array.from(this.users.values(), function (v) { return v.user; });
    };
    UserRepository.users = new Map();
    return UserRepository;
}());
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map