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

function isFilterGroup<T>(filter: Filter<T> | FilterGroup<T>): filter is FilterGroup<T> {
    return 'filters' in filter;
}

export function filterToPocketBase<T>(filter: Filter<T>): string {
    const isArrayValue = Array.isArray(filter.value);
    const values = isArrayValue ? filter.value : [filter.value];

    const parts = values.map((v: any) => {
        // The '?' prefix in PocketBase allows searching within multi-valued fields (arrays/relations)
        // or signifies "any" match when the right side is part of a list expansion.
        const operator = filterOperatorToPocketBase(filter.operator, filter.isNegated, isArrayValue);
        const valueStr = filterValueToString(v);
        return `${String(filter.key)}${operator}${valueStr}`;
    });

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];

    const logical = logicalToPocketBase(FilterLogical.Or);
    return `(${parts.join(` ${logical} `)})`;
}

export function filterGroupToPocketBase<T>(group: FilterGroup<T>): string {
    if (group.filters.length === 0) return '';

    const parts: string[] = [];

    let prev: Filter<T> | FilterGroup<T> | undefined = undefined;

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