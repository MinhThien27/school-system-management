import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const request: any = context.switchToHttp().getRequest<Request>();
        const { user } = request;
        return data ? user[data] : user;
    }
)