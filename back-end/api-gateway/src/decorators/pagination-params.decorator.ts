import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}

export const PaginationParams = createParamDecorator((data: any, ctx: ExecutionContext): Pagination => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);
    // console.log({page, size})

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException('Invalid pagination params');
    }
    // do not allowe to fetch large slices of dataset
    if (size > 100) {
        throw new BadRequestException('Invalid pagination params: Max size is 100');
    }
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
});