import {UserEntity} from './user-entity';

export interface RemoteMessage {
    id: number;
    author: UserEntity;
    target: UserEntity;
    body: string;
}
