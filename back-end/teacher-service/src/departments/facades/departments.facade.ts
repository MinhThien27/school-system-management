import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, throwError, timeout } from "rxjs";
import { RequestTimeoutRpcException } from "src/exceptoins";
import { Department, DepartmentWithDetail } from "../types/department-custom.type";
import { DepartmentWithDetailBuilder } from "../builders/department-with-detail.builder";

@Injectable()
export class DepartmentsFacade {

    constructor(
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy
    ) {}

    async getUserAccounctForHeadTeacher(headTeacher: Record<string, any>): Promise<Record<string, any>> {
        if (!headTeacher.id) throw new Error('headTeacherId not null');
        const userAccount =  await firstValueFrom(this.authServiceClient.send(
            { cmd: 'get-user-account' },
            headTeacher.id
        ).pipe(timeout({
            first: 10000,
            with: () => throwError(() => new RequestTimeoutRpcException())
        })));
        delete userAccount['password'];
        headTeacher['user'] = userAccount;
        return headTeacher;
    }

    async getDepartmentWithDetail(department: Department): Promise<DepartmentWithDetail> {
        let headTeacher: Record<string, any>;
        if (department.headTeacher) {
            headTeacher = await this.getUserAccounctForHeadTeacher(department.headTeacher)
        }
        const departmentWithDetailBuilder = new DepartmentWithDetailBuilder(department);
        return departmentWithDetailBuilder
            .withHeadTeacher(headTeacher)
            .build();
    }

    async getDepartmentsWithDetail(departments: Department[]): Promise<DepartmentWithDetail[]> {
        const departmentsWithDetail: DepartmentWithDetail[] = [];
        for (const department of departments) {
            departmentsWithDetail.push(await this.getDepartmentWithDetail(department));
        }
        return departmentsWithDetail;
    }
}