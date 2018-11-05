import {Socket} from "socket.io";

export class SocketController {
    private static clients: Socket[] = []; // better would be hashmap

    public static routes(io) {
        io.on('connection', function (socket) {
            SocketController.clients.push(socket);
            console.log('a user connected');
            // @ts-ignore
            const res: Socket = SocketController.clients.find((soc) => soc.id === socket.id);
            res.emit("message", "hello");
        });
    }

}