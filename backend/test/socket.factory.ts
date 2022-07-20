import { Observable, of } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export class SocketFactory {

    constructor(private readonly host: string) {}

    public channel(namespace: string, jwtToken: string, isNew: boolean = false): Observable<Channel> {
        const params = {
            extraHeaders: {
                'Authorization': 'Bearer ' + jwtToken
            },
            forceNew: isNew,
            reconnection: true,
            reconnectionAttempts: 2,
        };

        const _io: Socket = io(`${this.host}/${namespace}`, params);

        return of(new Channel(_io));
    }
}

export class Channel {

    public constructor(private socket: Socket) {}

    public event<T>(name: string): Observable<T> {
        return new Observable<T>(
            subscriber => {
                this.socket.on(name, (data: T) => subscriber.next(data));
                return () => this.socket.disconnect();
            }
        );
    }

    public emit(name: string, data: any): this {
        this.socket.emit(name, data);
        return this;
    }
}
