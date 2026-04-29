export const FilterType = {
    String: 'string',
    Number: 'number',
    Range: 'range',
    Choice: 'choice',
    Choices: 'choices',
} as const;
export type FilterType = typeof FilterType[keyof typeof FilterType];

export interface SingleBinding<T> {
    kind: 'single';
    key: keyof T;
}

export interface RangeBinding<T> {
    kind: 'range';
    keyMin: keyof T;
    keyMax: keyof T;
}
export type FieldBinding<T> = SingleBinding<T> | RangeBinding<T>;

export interface FilterChoice {
    label: string;
    value: any;
}

interface FilterDefinitionBase<T> {
    label: string;
    binding: FieldBinding<T>;
}

export interface StringFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.String;
    binding: SingleBinding<T>;
}

export interface NumberFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.Number;
    binding: SingleBinding<T>;
}

export interface RangeFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.Range;
    binding: RangeBinding<T>;   // enforced: must be a range binding
}

export interface ChoiceFilterDefinition<T> extends FilterDefinitionBase<T> {
    type: typeof FilterType.Choice | typeof FilterType.Choices;
    binding: SingleBinding<T>;
    availables: FilterChoice[];
}

export type FilterDefinition<T> =
    | StringFilterDefinition<T>
    | NumberFilterDefinition<T>
    | RangeFilterDefinition<T>
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