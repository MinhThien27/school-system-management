import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { AcademicYear } from "src/academic-years/types/academic-year-custom.type";
import { RequestTimeoutRpcException } from "src/exceptoins";

export class DeleteAcademicYearSagaState {

    constructor(
        private readonly classServiceClient: ClientProxy,
        private readonly academicYear: AcademicYear
    ) { }

    async makeDeleteClassesCommand() {
        console.log('Run makeDeleteClassesCommand')
        await firstValueFrom(this.classServiceClient.send(
            { cmd: 'delete-classes' },
            { academicYearId: this.academicYear.id }
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
    }
}