import {Socket} from 'socket.io';
import {UserConnection} from './user-connection';
import {User} from './user';

export class UserRepository {
    private static users: Map<string, UserConnection> = new Map();

    public static add(key: string, user: UserConnection) {
        this.users.set(key, user);
    }

    public static get(key: string): UserConnection {
        return this.users.get(key);
    }

    public static remove(key: string) {
        this.users.delete(key);
    }

    public static getAllUsers(): User[]{
       return Array.from(this.users.values(), v => v.user);
    }
}