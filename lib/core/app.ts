import * as Express from 'express';
import * as BodyParser from 'body-parser';
import * as Morgan from 'morgan';
import {Router} from './router';
import * as socketsIO from 'socket.io';
import {createServer, Server} from 'http';
import * as bodyParser from 'body-parser';
import * as ExpressSession from 'express-session';
import * as Cors from 'cors';

class App {

    private readonly app: Express.Application;
    private readonly io;
    public readonly server: Server;

    constructor() {
        this.app = Express();
        this.config();
        this.server = createServer(this.app);
        this.io = socketsIO(this.server);
        Router.routes(this.io);
    }

    private config(): void {

        this.app.use(Cors());
        this.app.use(Morgan('combined'));
        this.app.use(ExpressSession({ //must be set before Express.static('public') middleware otherwise doesnt work!!!
            secret: 'a68sd468aw6ad4w8d',
            resave: true,
            saveUninitialized: true,
            cookie: {httpOnly: true}
        })); // TODO: MemoryStore is not designed for a production environment
        this.app.use(Express.static('public'));
        this.app.use(bodyParser.json());       // to support JSON-encoded bodies

    }

}

export default new App().server;