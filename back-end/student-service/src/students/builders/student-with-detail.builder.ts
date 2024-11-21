import { Student, StudentWithDetail, User } from "../types/student-custom.type";
import { $Enums } from "@prisma/client";

export class StudentWithDetailBuilder {

    constructor(
        private readonly student?: Student,
        private id?: string,
        private firstName?: string,
        private lastName?: string,
        private dob?: Date,
        private gender?: $Enums.Gender,
        private enrollmentDate?: Date,
        private address?: string,
        private imageUrl?: string,
        private createdAt?: Date,
        private updatedAt?: Date,
        private classStudents?: Record<string, any>[],
        private userAccount?: User,
    ) {
        if (student) {
            this.id = student.id;
            this.firstName = student.firstName;
            this.lastName = student.lastName;
            this.dob = student.dob;
            this.gender = student.gender;
            this.enrollmentDate = student.enrollmentDate;
            this.address = student.address;
            this.imageUrl = student.imageUrl;
            this.createdAt = student.createdAt;
            this.updatedAt = student.updatedAt;
            this.classStudents = classStudents;
        }
    }

    withUserAccount(userAccount: User): StudentWithDetailBuilder {
        this.userAccount = userAccount;
        return this;
    }

    withClassStudents(classStudents: Record<string, any>[]): StudentWithDetailBuilder {
        this.classStudents = classStudents;
        return this;
    }

    build(): StudentWithDetail {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            dob: this.dob,
            gender: this.gender,
            enrollmentDate: this.enrollmentDate,
            address: this.address,
            imageUrl: this.imageUrl,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            classStudents: this.classStudents as any,
            user: this.userAccount
        }
    }
}