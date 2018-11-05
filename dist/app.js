"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var router_1 = require("./router");
var socket_controller_1 = require("./socket_controller");
var socketsIO = require("socket.io");
var http_1 = require("http");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.config();
        this.server = http_1.createServer(this.app);
        this.io = socketsIO(this.server);
        router_1.Router.routes(this.app);
        socket_controller_1.SocketController.routes(this.io);
    }
    App.prototype.config = function () {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'));
    };
    return App;
}());
exports.default = new App().server;
//# sourceMappingURL=app.js.map