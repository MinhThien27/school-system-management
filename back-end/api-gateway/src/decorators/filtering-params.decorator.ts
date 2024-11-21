import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface Filtering {
    property: string;
    rule: string;
    value: any;
}

export enum FilterRule {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator((params: string[], ctx: ExecutionContext): Filtering[] => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const filter: any = req.query.filter;
    if (!filter) return null;

    const filters: string[] = typeof filter === 'string' ? [filter] : filter;
    const filteringResults: Filtering[] = [];
    for (const filter of filters) {
        // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
        if (!filter.match(/^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9-_,]+$/) && !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)) {
            throw new BadRequestException('Invalid filter parameter');
        }

        // extract the parameters and validate if the rule and the property are valid
        const [property, rule, value] = filter.split(':');
        if (!params?.includes(property)) throw new BadRequestException(`Invalid filter property: ${property}`);
        if (!Object.values(FilterRule).includes(rule as FilterRule)) throw new BadRequestException(`Invalid filter rule: ${rule}`);
        filteringResults.push({ property, rule, value });
    }
    return filteringResults;
});