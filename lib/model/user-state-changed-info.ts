import {UserEntity} from './user-entity';

export class UserStateChangedInfo {
    from: UserEntity;
    to: UserEntity;
}