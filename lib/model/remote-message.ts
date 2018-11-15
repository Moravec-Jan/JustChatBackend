import {User} from './user';

export interface RemoteMessage {
    id: number;
    author: User;
    target: User;
    body: string;
}
