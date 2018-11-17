import {UserEntity} from './user-entity';

export interface LoggedData {
    id: string;
    name: string,
    users: UserEntity[];
    status: string;
}
