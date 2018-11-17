"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var PORT = 3000;
// choose port of process (for heroku) or 3000 (for development)
app_1.default.listen(process.env.PORT || PORT, function () {
    console.log('Express server listening on port ' + PORT);
});
//# sourceMappingURL=server.js.map