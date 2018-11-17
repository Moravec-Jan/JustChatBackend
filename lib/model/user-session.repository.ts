import {Socket} from 'socket.io';
import {UserConnection} from './user-connection';
import {UserEntity} from './user-entity';

export class UserSessionRepository {
    private static activeSessions: Map<string, UserConnection> = new Map();
    private static archivedSessions: Map<string, UserConnection> = new Map();
    private static userIdToSessionIdMap: Map<string, string> = new Map();

    public static add(key: string, user: UserConnection) {
        this.activeSessions.set(key, user);
        this.userIdToSessionIdMap.set(user.user.id, key);
    }

    public static getBySessionId(key: string): UserConnection {
        return this.activeSessions.get(key);
    }

    public static getFromArchiveBySessionId(key: string): UserConnection {
        return this.archivedSessions.get(key);
    }

    public static getByUserId(id: string): UserConnection {
        const sessionId = this.userIdToSessionIdMap.get(id);
        if (sessionId) {
            return this.getBySessionId(sessionId);
        }
    }

    public static remove(key: string) {
        const userConnection = this.activeSessions.get(key);
        if (userConnection) {
            this.userIdToSessionIdMap.delete(userConnection.user.id);
            this.activeSessions.delete(key);
        }
    }

    public static update(id: string, socket: Socket, entity: UserEntity) {
        this.remove(id);
        this.add(id, new UserConnection(socket, entity));
    }

    public static getAllUsers(): UserEntity[] {
        return Array.from(this.activeSessions.values(), v => v.user);
    }

    public static getAllUsersExcept(userId: string): UserEntity[] {
        return Array.from(this.activeSessions.values(), v => v.user)
            .filter(value => value.id !== userId);
    }

    public static moveToArchive(key: string) {
        const user = UserSessionRepository.getBySessionId(key);
        if (user) {
            UserSessionRepository.remove(key);
            UserSessionRepository.archivedSessions.set(key, user);
        }
    }

    public static moveToActive(key: string) {
        const user = UserSessionRepository.getFromArchiveBySessionId(key);
        if (user) {
            this.archivedSessions.delete(key);
            UserSessionRepository.add(key, user);
        }
    }

    //TODO: delete not active sessions, for now they are never removed!
}