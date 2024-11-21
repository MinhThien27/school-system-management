import { Body, Controller, Get, Patch, ValidationPipe } from "@nestjs/common";
import { SchoolConfigurationsService } from "./services/school-configurations.service";
import { UpdateSchoolConfigurationDto } from "./dtos/update-school-configuration.dto";

@Controller({ path: 'configurations', version: '1' })
export class SchoolConfigurationsController {

    constructor(private readonly schoolConfigurationsService: SchoolConfigurationsService) {}

    @Get()
    getSchoolConfiguration() {
        return this.schoolConfigurationsService.getSchoolConfiguration();
    }

    @Patch()
    updateSchoolConfiguration(
        @Body(new ValidationPipe({ whitelist: true })) updateSchoolConfigurationDto: UpdateSchoolConfigurationDto
    ) {
        return this.schoolConfigurationsService.updateSchoolConfiguration(updateSchoolConfigurationDto);
    }
}