import {UserEntity} from './user-entity';

export interface LoggedData {
    name: string,
    users: UserEntity[];
    status: string;
}
