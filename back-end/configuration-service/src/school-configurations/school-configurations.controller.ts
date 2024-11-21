import { Controller, UseFilters } from "@nestjs/common";
import { AllExceptionsFilter } from "src/exception-filters";
import { SchoolConfigurationsService } from "./services/school-configurations.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UpdateSchoolConfigurationDto } from "./dtos/udpate-school-configuration.dto";

@Controller()
@UseFilters(AllExceptionsFilter)
export class SchoolConfigurationsController {

    constructor(private readonly schoolConfigurationsService: SchoolConfigurationsService) {}

    @MessagePattern({ cmd: 'get-school-configuration' })
    getSchoolConfiguration() {
        return this.schoolConfigurationsService.getSchoolConfiguration();
    }

    @MessagePattern({ cmd: 'update-school-configuration' })
    updateSchoolConfiguration(
        @Payload('dto') updateSchoolConfigurationDto: UpdateSchoolConfigurationDto
    ) {
        return this.schoolConfigurationsService.updateSchoolConfiguration(updateSchoolConfigurationDto);
    }
}