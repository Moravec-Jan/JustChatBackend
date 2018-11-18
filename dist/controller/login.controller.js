"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var name_generator_1 = require("../model/name-generator");
var user_session_repository_1 = require("../model/user-session.repository");
var api_1 = require("../core/api");
var user_connection_1 = require("../model/user-connection");
var user_data_repository_1 = require("../model/user-data.repository");
var bcrypt = require("bcrypt");
var validator = require("validator");
var uniqid = require("uniqid");
var socket_utility_1 = require("../util/socket.utility");
// noinspection ES6ConvertVarToLetConst
var LoginController = /** @class */ (function () {
    function LoginController() {
    }
    LoginController.register = function (socket, data) {
        var _this = this;
        //validate data
        var error = LoginController.validateUserData(data);
        if (error !== '') {
            socket.emit(api_1.Api.REGISTER_REQUEST_ID, { status: 'error', error: error }); // to sender
            return;
        }
        //check email existence
        if (user_data_repository_1.UserDataRepository.exists(data.email)) {
            socket.emit(api_1.Api.REGISTER_REQUEST_ID, { status: 'error', error: 'Email address has already been used.' }); // to sender
            return;
        }
        //lets store user data and send messages
        bcrypt.hash(data.password, this.saltRounds, function (err, hash) {
            if (err) {
                _this.sendServerError(socket, err);
            }
            else {
                var currentUserData = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(socket));
                var newUserEntity = { id: uniqid(), name: data.nickname };
                if (currentUserData) {
                    socket.broadcast.emit(api_1.Api.OTHER_USER_STATE_CHANGED, { from: currentUserData.user, to: newUserEntity });
                }
                else {
                    socket.broadcast.emit(api_1.Api.OTHER_USER_LOGGED_IN_ID, newUserEntity);
                }
                user_data_repository_1.UserDataRepository.add({ id: newUserEntity.id, nickname: data.nickname, email: data.email, password: hash }); // store hash
                _this.updateUserConnection(socket, newUserEntity);
                var info = _this.createSuccessfulInfo(socket, data);
                socket.emit(api_1.Api.REGISTER_REQUEST_ID, info); // to sender
            }
        });
    };
    LoginController.createSuccessfulInfo = function (socket, data) {
        var userConnection = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(socket));
        var users = user_session_repository_1.UserSessionRepository.getAllUsersExcept(userConnection.user.id);
        return { name: data.nickname, users: users, status: 'success' };
    };
    LoginController.sendServerError = function (socket, err) {
        socket.emit(api_1.Api.REGISTER_REQUEST_ID, { status: 'error', error: 'Server error has occurred!' });
        console.log(err);
    };
    LoginController.generateGuestData = function () {
        var id = uniqid();
        var name = name_generator_1.NameGenerator.generateName();
        return { id: id, name: name };
    };
    LoginController.updateUserConnection = function (socket, userEntity) {
        var id = socket_utility_1.SocketUtility.getSessionId(socket);
        var userConnection = user_session_repository_1.UserSessionRepository.getBySessionId(id);
        if (!userConnection) {
            userConnection = new user_connection_1.UserConnection(socket, userEntity); // create new
            user_session_repository_1.UserSessionRepository.add(socket_utility_1.SocketUtility.getSessionId(socket), userConnection);
        }
        else {
            user_session_repository_1.UserSessionRepository.update(id, socket, userEntity);
        }
    };
    LoginController.onDisconnect = function (socket) {
        console.log('UserConnection with ID: ' + socket_utility_1.SocketUtility.getSessionId(socket) + ' has been disconnected');
        var userConnection = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(socket));
        if (userConnection) {
            user_session_repository_1.UserSessionRepository.moveToArchive(socket_utility_1.SocketUtility.getSessionId(socket));
            socket.broadcast.emit(api_1.Api.OTHER_USER_LOGGED_OUT_ID, { id: userConnection.user.id }); //receive all except sender
        }
    };
    LoginController.logout = function (socket) {
        var userConnection = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(socket));
        user_session_repository_1.UserSessionRepository.remove(socket_utility_1.SocketUtility.getSessionId(socket));
        if (userConnection) {
            socket.broadcast.emit(api_1.Api.OTHER_USER_LOGGED_OUT_ID, { id: userConnection.user.id }); //notify others
            socket.emit(api_1.Api.LOGOUT_REQUEST_ID); //notify user
        }
    };
    LoginController.validateUserData = function (data) {
        var error = '';
        if (!data || !data.password || !data.nickname || !data.email) {
            return 'All parameters must be filled up!';
        }
        if (!validator.isEmail(data.email)) {
            error += 'Invalid email! \n';
        }
        if (typeof data.password !== 'string' || !validator.isLength(data.password, { min: 8, max: 100 })) {
            error += 'Password must be between 8-100 characters!\n';
        }
        if (typeof data.password !== 'string' || !validator.isLength(data.nickname, { min: 4, max: 100 })) {
            error += 'Nickname must be between 4-20 characters!\n';
        }
        return error;
    };
    LoginController.saltRounds = 12;
    LoginController.connectUser = function (socket) {
        // try to find session if does not exist create new guest
        var id = socket_utility_1.SocketUtility.getSessionId(socket);
        var connection = user_session_repository_1.UserSessionRepository.getBySessionId(id);
        var user = connection ? connection.user : LoginController.generateGuestData();
        var users = user_session_repository_1.UserSessionRepository.getAllUsersExcept(user.id);
        var info = { id: user.id, name: user.name, users: users, status: 'success' };
        socket.broadcast.emit(api_1.Api.OTHER_USER_LOGGED_IN_ID, user); //receive all except sender
        if (!connection) {
            //for new users
            user_session_repository_1.UserSessionRepository.add(socket_utility_1.SocketUtility.getSessionId(socket), new user_connection_1.UserConnection(socket, user));
            socket.emit(api_1.Api.GUEST_LOGIN_REQUEST_ID, info); // logged as guest
        }
        else {
            // for earlier logged
            user_session_repository_1.UserSessionRepository.moveToActive(id); // move to active
            user_session_repository_1.UserSessionRepository.update(id, socket, user);
            if (user_data_repository_1.UserDataRepository.getById(connection.user.id)) {
                socket.emit(api_1.Api.USER_LOGIN_REQUEST_ID, info); //user
            }
            else {
                socket.emit(api_1.Api.GUEST_LOGIN_REQUEST_ID, info); //guest
            }
        }
    };
    LoginController.userLogin = function (socket, data) {
        var userData = user_data_repository_1.UserDataRepository.get(data.email);
        if (userData) {
            bcrypt.compare(data.password, userData.password, function (err, res) {
                if (res) { //right password
                    var originalSessionData = user_session_repository_1.UserSessionRepository.getBySessionId(socket_utility_1.SocketUtility.getSessionId(socket));
                    var userEntity = { name: userData.nickname, id: userData.id };
                    if (originalSessionData) {
                        // session still exists
                        socket.broadcast.emit(api_1.Api.OTHER_USER_STATE_CHANGED, { from: originalSessionData.user, to: userEntity });
                    }
                    else {
                        // didnt find session data, other users will loose conversation connection
                        socket.broadcast.emit(api_1.Api.OTHER_USER_LOGGED_IN_ID, userEntity);
                    }
                    LoginController.updateUserConnection(socket, userEntity);
                    var info = LoginController.createSuccessfulInfo(socket, userData);
                    socket.emit(api_1.Api.USER_LOGIN_REQUEST_ID, info); // to sender
                }
                else {
                    socket.emit(api_1.Api.USER_LOGIN_REQUEST_ID, { status: 'error', error: 'Wrong email and password combination.' });
                }
            });
        }
        else {
            socket.emit(api_1.Api.USER_LOGIN_REQUEST_ID, { status: 'error', error: 'Wrong email and password combination.' });
        }
    };
    return LoginController;
}());
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map