export const FilterType = {
    Number: 'number',
    Choice: 'choice',
    Choices: 'choices',
} as const;
export type FilterType = typeof FilterType[keyof typeof FilterType];

export interface FilterChoice {
    label: string;
    value: any;
}

export interface NumberRange {
    min: number;
    max: number;
}

// Discriminated union of filter shapes — `type` is the discriminator
export interface NumberFilter {
    type: typeof FilterType.Number;
    label: string;
}

export interface ChoiceFilter {
    type: typeof FilterType.Choice;
    label: string;
    availables: FilterChoice[];
}

export interface ChoicesFilter {
    type: typeof FilterType.Choices;
    label: string;
    availables: FilterChoice[];
}

export type Filter = NumberFilter | ChoiceFilter | ChoicesFilter;