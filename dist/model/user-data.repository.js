"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserDataRepository = /** @class */ (function () {
    function UserDataRepository() {
    }
    UserDataRepository.add = function (user) {
        this.users.set(user.email, user);
    };
    UserDataRepository.get = function (email) {
        return this.users.get(email);
    };
    UserDataRepository.remove = function (email) {
        this.users.delete(email);
    };
    UserDataRepository.exists = function (email) {
        return this.users.has(email);
    };
    UserDataRepository.getById = function (id) {
        var userData;
        Array.from(this.users.values()).forEach(function (value) {
            if (value.id === id) {
                userData = value;
            }
        });
        return userData;
    };
    // if we would use db, we should sanitize input data to prevent sql injection
    UserDataRepository.users = new Map();
    return UserDataRepository;
}());
exports.UserDataRepository = UserDataRepository;
//# sourceMappingURL=user-data.repository.js.map