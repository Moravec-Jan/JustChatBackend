import * as express from "express";
import * as bodyParser from "body-parser";
import {Router} from "./router";
import {SocketController} from "./socket_controller";
import * as socketsIO from "socket.io";
import {createServer, Server} from 'http';

class App {

    public app: express.Application;
    public io;
    public server: Server;

    constructor() {
        this.app = express();
        this.config();
        this.server = createServer(this.app);
        this.io = socketsIO(this.server);
        Router.routes(this.app);
        SocketController.routes(this.io);
    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'));
    }

}

export default new App().server;