import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateSchoolConfigurationDto } from "../dtos/update-school-configuration.dto";
import { throwError, timeout } from "rxjs";

@Injectable()
export class SchoolConfigurationsService {

    constructor(@Inject('CONFIGURATION_SERVICE') private readonly configurationServiceClient: ClientProxy) {}

    getSchoolConfiguration() {
        return this.configurationServiceClient.send({ cmd: 'get-school-configuration' }, {})
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }

    updateSchoolConfiguration(updateConfigurationDto: UpdateSchoolConfigurationDto) {
        return this.configurationServiceClient.send({ cmd: 'update-school-configuration' }, { dto: updateConfigurationDto })
            .pipe(
                timeout({
                    first: 10000,
                    with: () => throwError(() => new RequestTimeoutException())
                })
            );
    }
}