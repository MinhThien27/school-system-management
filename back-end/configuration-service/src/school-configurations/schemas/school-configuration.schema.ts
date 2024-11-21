import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: 'school_configurations' })
export class SchoolConfiguration {
    @Prop({ required: false, default: '' })
    schoolName: string;

    @Prop({ required: false, min: 1, default: 2 })
    numberOfSemesters: number;

    @Prop({ required: false, min: 1, default: 1 })
    numberOfRooms: number;

    @Prop({ required: false, min: 1, default: 1 })
    numberOfTeachers: number;

    @Prop({ required: false, min: 30, default: 30 })
    numberOfStudents: number;
}

export const SchoolConfigurationSchema = SchemaFactory.createForClass(SchoolConfiguration);