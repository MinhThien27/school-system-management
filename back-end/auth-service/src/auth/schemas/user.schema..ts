import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Role {
    Student = 'Student',
    Teacher = 'Teacher',
    Admin = 'Admin'
}

@Schema({ timestamps: true })
export class User {
    @Prop()
    _id: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    password: string;

    @Prop({ unique: true })
    citizenIdentification: string;

    @Prop({ unique: true })
    phoneNumber: string;

    @Prop({ type: String, required: true, enum: ['Student', 'Teacher', 'Admin'] })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);