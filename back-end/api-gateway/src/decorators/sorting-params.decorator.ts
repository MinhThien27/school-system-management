import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Sorting {
    property: string;
    direction: string;
}

export const SortingParams = createParamDecorator((params: string[], ctx: ExecutionContext): Sorting[] => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const sort: any = req.query.sort;
    if (!sort) return null;

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    const sorts: string[] = typeof sort === 'string' ? [sort] : sort;
    const sortingResults: Sorting[] = [];
    for (const sort of sorts) {
        // check the format of the sort query param
        if (!sort.match(sortPattern)) throw new BadRequestException('Invalid sort parameter');

        // extract the property name and direction and check if they are valid
        const [property, direction] = sort.split(':');
        if (!params?.includes(property)) throw new BadRequestException(`Invalid sort property: ${property}`);
        sortingResults.push({ property, direction });
    }
    return sortingResults;
});