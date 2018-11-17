import {Socket} from 'socket.io';
import {UserConnection} from './user-connection';
import {UserEntity} from './user-entity';
import {UserData} from './user-data';

export class UserDataRepository {
    // if we would use db, we should sanitize input data to prevent sql injection

    private static users: Map<string, UserData> = new Map();

    public static add(user: UserData) {
        this.users.set(user.email, user);
    }

    public static get(email: string): UserData {
        return this.users.get(email);
    }

    public static remove(email: string) {
        this.users.delete(email);
    }

    public static exists(email: string): boolean {
        return this.users.has(email);
    }

    public static getById(id: string): UserData {
        let userData: UserData;
        Array.from(this.users.values()).forEach(value => {
            if (value.id === id) {
                userData = value;
            }
        });

        return userData;
    }
}
