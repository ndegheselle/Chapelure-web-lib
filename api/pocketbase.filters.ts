import { FilterLogical, FilterOperator, type Filter, type FilterGroup } from "@chapelure/api/filters";

function filterValueToString(value: any): string {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    return `'${String(value).replace(/'/g, "\\'")}'`;
}

function filterOperatorToPocketBase(operator: FilterOperator, isNegated: boolean, isAny = false): string {
    const prefix = isAny ? '?' : '';
    switch (operator) {
        case FilterOperator.Equals:
            return isNegated ? `${prefix}!=` : `${prefix}=`;
        case FilterOperator.Contains:
            return isNegated ? `${prefix}!~` : `${prefix}~`;
        case FilterOperator.GreaterThan:
            return isNegated ? `${prefix}<=` : `${prefix}>`;
        case FilterOperator.LessThan:
            return isNegated ? `${prefix}>=` : `${prefix}<`;
    }
}

function logicalToPocketBase(logical: FilterLogical): string {
    return logical === FilterLogical.Or ? '||' : '&&';
}

function isFilterGroup(filter: Filter | FilterGroup): filter is FilterGroup {
    return 'filters' in filter;
}

export function filterToPocketBase(filter: Filter): string {
    const operator = filterOperatorToPocketBase(filter.operator, filter.isNegated);
    const value = filterValueToString(filter.value);
    return `${filter.key}${operator}${value}`;
}

export function filterGroupToPocketBase(group: FilterGroup): string {
    if (group.filters.length === 0) return '';

    const parts: string[] = [];

    let prev: Filter | FilterGroup | undefined = undefined;

    for (const item of group.filters) {
        const expr = isFilterGroup(item)
            ? `(${filterGroupToPocketBase(item)})`
            : filterToPocketBase(item);

        if (prev === undefined) {
            parts.push(expr);
        } else {
            const logical = logicalToPocketBase(prev.combine);
            parts.push(logical, expr);
        }
        prev = item;
    }

    return parts.join(' ');
}