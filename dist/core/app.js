"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require("express");
var Morgan = require("morgan");
var router_1 = require("./router");
var socketsIO = require("socket.io");
var http_1 = require("http");
var bodyParser = require("body-parser");
var ExpressSession = require("express-session");
var Cors = require("cors");
var App = /** @class */ (function () {
    function App() {
        this.app = Express();
        this.config();
        this.server = http_1.createServer(this.app);
        this.io = socketsIO(this.server);
        router_1.Router.routes(this.io);
    }
    App.prototype.config = function () {
        this.app.use(Cors());
        this.app.use(Morgan('combined'));
        this.app.use(ExpressSession({
            secret: 'a68sd468aw6ad4w8d',
            resave: true,
            saveUninitialized: true,
            cookie: { httpOnly: true }
        }));
        this.app.use(Express.static('public'));
        this.app.use(bodyParser.json()); // to support JSON-encoded bodies
    };
    return App;
}());
exports.default = new App().server;
//# sourceMappingURL=app.js.map