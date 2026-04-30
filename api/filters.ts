/**
 * Type of a filter field
 */
export const FilterType = {
    String: 'string',
    Number: 'number',
    Choice: 'choice',
} as const;
export type FilterType = typeof FilterType[keyof typeof FilterType];

/**
 * Kind of binding for a filter definition
 */
export const BindingKind = {
    Single: 'single',
    Range: 'range',
} as const;
export type BindingKind = typeof BindingKind[keyof typeof BindingKind];

export interface SingleBinding<T> {
    kind: typeof BindingKind.Single;
    key: keyof T;
}

export interface RangeBinding<T> {
    kind: typeof BindingKind.Range;
    keyMin: keyof T;
    keyMax: keyof T;
}

/**
 * Binding of a filter definition, one filter can be binded to multiple fields
 */
export type FieldBinding<T> = SingleBinding<T> | RangeBinding<T>;

/**
 * Filter choice item for choice filters
 */
export interface FilterChoice {
    label: string;
    value: any;
}

interface FilterDefinitionBase<T> {
    label: string;
    binding: FieldBinding<T>;
}

export interface ValueFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.Number;
    binding: FieldBinding<T>;
}

export interface ChoiceFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.Choice;
    binding: SingleBinding<T>;
    multiple?: boolean;
    availables: FilterChoice[];
}

export type FilterDefinition<T> =
    | ValueFilterDefinition<T>
    | ChoiceFilterDefinition<T>;

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