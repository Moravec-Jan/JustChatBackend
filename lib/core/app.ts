import * as Express from 'express';
import * as BodyParser from 'body-parser';
import * as Morgan from 'morgan';
import {Router} from './router';
import * as socketsIO from 'socket.io';
import {createServer, Server} from 'http';

class App {

    public app: Express.Application;
    public io;
    public server: Server;

    constructor() {
        this.app = Express();
        this.config();
        this.server = createServer(this.app);
        this.io = socketsIO(this.server);
        Router.routes(this.io);
    }

    private config(): void {
        // support application/json type post data
        this.app.use(Morgan('combined'));
        this.app.use(BodyParser.json());
        this.app.use(Express.static('public'));
    }

}

export default new App().server;