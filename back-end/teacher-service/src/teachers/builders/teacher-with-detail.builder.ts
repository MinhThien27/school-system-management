import { Teacher, TeacherWithDetail, User } from "../types/teacher-custom.type";
import { $Enums } from "@prisma/client";

export class TeacherWithDetailBuilder {

    constructor(
        private readonly teacher?: Teacher,
        private id?: string,
        private firstName?: string,
        private lastName?: string,
        private dob?: Date,
        private gender?: $Enums.Gender,
        private startDate?: Date,
        private address?: string,
        private imageUrl?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private departmentTeachers?: Record<string, any>[],
        private userAccount?: User,
    ) {
        if (teacher) {
            this.id = teacher.id;
            this.firstName = teacher.firstName;
            this.lastName = teacher.lastName;
            this.dob = teacher.dob;
            this.gender = teacher.gender;
            this.startDate = teacher.startDate;
            this.address = teacher.address;
            this.imageUrl = teacher.imageUrl;
            this.createdAt = teacher.createdAt;
            this.updatedAt = teacher.updatedAt;
            this.departmentTeachers = departmentTeachers;
        }
    }

    withUserAccount(userAccount: User): TeacherWithDetailBuilder {
        this.userAccount = userAccount;
        return this;
    }

    withDepartmentTeachers(departmentTeachers: Record<string, any>[]): TeacherWithDetailBuilder {
        this.departmentTeachers = departmentTeachers;
        return this;
    }

    build(): TeacherWithDetail {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            dob: this.dob,
            gender: this.gender,
            startDate: this.startDate,
            address: this.address,
            imageUrl: this.imageUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            departmentTeachers: this.departmentTeachers as any,
            user: this.userAccount
        }
    }
}