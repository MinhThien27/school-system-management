import { Injectable } from "@nestjs/common";
import { SchoolConfigurationsRepository } from "../repositories/school-configurations.repository";
import { UpdateSchoolConfigurationDto } from "../dtos/udpate-school-configuration.dto";
import { SchoolConfiguration } from "../schemas/school-configuration.schema";

@Injectable()
export class SchoolConfigurationsService {

    constructor(private readonly schoolConfigurationsRepository: SchoolConfigurationsRepository) {}
    
    getSchoolConfiguration(): Promise<SchoolConfiguration> {
        return this.schoolConfigurationsRepository.findSchoolConfiguration({});
    }

    updateSchoolConfiguration(updateSchoolConfigurationDto: UpdateSchoolConfigurationDto): Promise<SchoolConfiguration> {
        return this.schoolConfigurationsRepository.updateSchoolConfiguration(updateSchoolConfigurationDto);
    }
}