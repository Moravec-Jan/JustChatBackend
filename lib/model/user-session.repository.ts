import {Socket} from 'socket.io';
import {UserConnection} from './user-connection';
import {UserEntity} from './user-entity';

export class UserSessionRepository {
    private static users: Map<string, UserConnection> = new Map();
    private static userIdToSessionIdMap: Map<string, string> = new Map();

    public static add(key: string, user: UserConnection) {
        this.users.set(key, user);
        this.userIdToSessionIdMap.set(user.user.id, key);
    }

    public static getBySessionId(key: string): UserConnection {
        return this.users.get(key);
    }

    public static getByUserId(id: string): UserConnection {
        const sessionId = this.userIdToSessionIdMap.get(id);
        if (sessionId) {
            return this.getBySessionId(sessionId);
        }
    }

    public static remove(key: string) {
        const userConnection = this.users.get(key);
        if (userConnection) {
            this.userIdToSessionIdMap.delete(userConnection.user.id);
            this.users.delete(key);
        }
    }

    public static getAllUsers(): UserEntity[] {
        return Array.from(this.users.values(), v => v.user);
    }

    public static getAllUsersExcept(userId: string): UserEntity[] {
        return Array.from(this.users.values(), v => v.user)
            .filter(value => value.id !== userId);
    }

    //TODO: delete not active sessions, for now they are never removed!
}