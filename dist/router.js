"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.routes = function (app) {
        var _this = this;
        app.route('/')
            .get(function (req, res) {
            console.log(_this.getViewPath("index"));
            res.status(200).sendFile(_this.getViewPath("index"));
        });
    };
    Router.getViewPath = function (name) {
        return Path.join(__dirname + '/../public/' + name + '.html');
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map