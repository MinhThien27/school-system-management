import { Role } from "src/enums";

export interface UserEntity {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: Role;
}