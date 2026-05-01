// --- Filters values ---
export const FilterOperator = {
    Equals: 'equals',
    Contains: 'contains',
    GreaterThan: 'greaterThan',
    LessThan: 'lessThan'
} as const;
export type FilterOperator = typeof FilterOperator[keyof typeof FilterOperator];

export const FilterLogical = {
    Or: 'or',
    And: 'and'
} as const;
export type FilterLogical = typeof FilterLogical[keyof typeof FilterLogical];

export interface Filter {
    key: string;
    value: any;
    operator: FilterOperator;
    isNegated: boolean;
    combine: FilterLogical;
}

export interface FilterGroup {
    filters: (Filter | FilterGroup)[];
    combine: FilterLogical;
}

export function createFilter(filter: Partial<Filter>): Filter {
    return {
        operator: FilterOperator.Contains,
        combine: FilterLogical.And,
        isNegated: false,
        ...filter,
    } as Filter;
}

export function createGroup(group: Partial<FilterGroup>): FilterGroup {
    return {
        combine: FilterLogical.And,
        ...group,
    } as FilterGroup;
}