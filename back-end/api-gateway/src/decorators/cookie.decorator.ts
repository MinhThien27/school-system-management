import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const Cookie = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        const { cookies } = request;
        return data ? cookies[data] : cookies;
    }
);