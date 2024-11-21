import { Injectable } from "@nestjs/common";
import { SchoolConfiguration } from "../schemas/school-configuration.schema";
import { FilterQuery, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateSchoolConfigurationDto } from "../dtos/create-school-configuration.dto";
import { UpdateSchoolConfigurationDto } from "../dtos/udpate-school-configuration.dto";

@Injectable()
export class SchoolConfigurationsRepository {

    constructor(
        @InjectModel(SchoolConfiguration.name) private readonly schoolCongigurationModel: Model<SchoolConfiguration>
    ) {}

    async countDocuments(): Promise<number> {
        return await this.schoolCongigurationModel.countDocuments();
    }

    async findSchoolConfiguration(filterQuery: FilterQuery<SchoolConfiguration>): Promise<SchoolConfiguration> {
        const schoolConfiguration = await this.schoolCongigurationModel.findOne(filterQuery).lean().exec();
        return schoolConfiguration;
    }

    async createSchoolConfiguration(createSchoolConfigurationDto: CreateSchoolConfigurationDto): Promise<SchoolConfiguration> {
        const createdSchoolConfiguration = await this.schoolCongigurationModel.create(createSchoolConfigurationDto);
        return createdSchoolConfiguration.toObject();
    }

    async updateSchoolConfiguration(updateSchoolConfigurationDto: UpdateSchoolConfigurationDto): Promise<SchoolConfiguration> {
        const updatedSchoolConfiguration = await this.schoolCongigurationModel.findOneAndUpdate(
            {}, 
            updateSchoolConfigurationDto,
            {
                new: true
            }
        );
        return updatedSchoolConfiguration.toObject();
    }
}