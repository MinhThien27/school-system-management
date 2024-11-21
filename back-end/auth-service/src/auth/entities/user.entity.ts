import { Role } from "../schemas/user.schema.";

export interface UserEntity {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: Role;
}