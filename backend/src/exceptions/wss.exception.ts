import {WsException} from "@nestjs/websockets";
import {Socket} from "socket.io";

export class WssException extends WsException{
    public constructor(error: string, client: Socket) {
        super(error);
        client.send('exception', {
            status: 'error',
            message: error
        });
        client.disconnect(true);
    }
}
