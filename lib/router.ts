import {Request, Response} from "express";
import * as Path from 'path';

export class Router {
    public static routes(app): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).sendFile(this.getViewPath("index"));
            })
    }

    public static getViewPath(name: string): string {
        return Path.join(__dirname + '/../public/' + name + '.html')
    }
}