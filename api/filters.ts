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

export interface Filter<T> {
    key: keyof T;
    value: any;
    operator: FilterOperator;
    isNegated: boolean;
    combine: FilterLogical;
}

export interface FilterGroup<T> {
    filters: (Filter<T> | FilterGroup<T>)[];
    combine: FilterLogical;
}

export function createFilter<T>(filter: Partial<Filter<T>>): Filter<T> {
    return {
        operator: FilterOperator.Contains,
        combine: FilterLogical.And,
        isNegated: false,
        ...filter,
    } as Filter<T>;
}

export function createGroup<T>(group: Partial<FilterGroup<T>>): FilterGroup<T> {
    return {
        combine: FilterLogical.And,
        filters: [],
        ...group,
    } as FilterGroup<T>;
}

export function removeEmptyFilters<T>(group: FilterGroup<T>): FilterGroup<T> {
    const cleanedFilters = group.filters
        .map(f => {
            if ('filters' in f) {
                return removeEmptyFilters(f);
            } else {
                if (Array.isArray(f.value)) return f.value.length ? f : null;
                return f.value ? f : null;
            }
        })
        .filter((f): f is Filter<T> | FilterGroup<T> => f !== null);
    return {
        ...group,
        filters: cleanedFilters
    };
}