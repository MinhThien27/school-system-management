import { FilterRule } from "src/enums";
import { Filtering, Sorting } from "src/interfaces";

export const getSorts = (sorts: Sorting[], props: string[]): Sorting[] => {
    if (!sorts || !props) return [];
    return sorts.filter(filter => props.includes(filter.property));
}

export const getFilters = (filters: Filtering[], props: string[]): Filtering[] => {
    if (!filters || !props) return [];
    return filters.filter(filter => props.includes(filter.property));
}

export const getOrder = (sorts: Sorting[]): Record<string, any>[] => {
    if (!sorts) return [];
    
    const orderByArr: Record<string, any>[] = [];
    for (const sort of sorts) {
        orderByArr.push({ [sort.property]: sort.direction });
    }
    return orderByArr;
}

export const getWhere = (filters: Filtering[]): Record<string, any> => {
    if (!filters) return {};

    const whereObj: Record<string, any> = {};
    for (const filter of filters) {
        if (filter.rule === FilterRule.IS_NULL) whereObj[filter.property] = null;
        if (filter.rule === FilterRule.IS_NOT_NULL) whereObj[filter.property] = { not: null };
        if (filter.rule === FilterRule.EQUALS) whereObj[filter.property] = filter.value;
        if (filter.rule === FilterRule.NOT_EQUALS) whereObj[filter.property] = { not: filter.value };
        if (filter.rule === FilterRule.GREATER_THAN) whereObj[filter.property] = { gt: filter.value };
        if (filter.rule === FilterRule.GREATER_THAN_OR_EQUALS) whereObj[filter.property] = { gte: filter.value };
        if (filter.rule === FilterRule.LESS_THAN) whereObj[filter.property] = { lt: filter.value };
        if (filter.rule === FilterRule.LESS_THAN_OR_EQUALS) whereObj[filter.property] = { lte: filter.value };
        if (filter.rule === FilterRule.LIKE) whereObj[filter.property] = { search: filter.value };
        if (filter.rule === FilterRule.NOT_LIKE) whereObj[filter.property] = { search: `!${filter.value}` };
        if (filter.rule === FilterRule.IN) whereObj[filter.property] = { in: filter.value.split(',') };
        if (filter.rule === FilterRule.NOT_IN) whereObj[filter.property] = { notIn: filter.value.split(',') };
    };
    return whereObj;
};