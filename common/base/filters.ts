import { type Component } from 'vue';

type FieldType = "number" | "choice" | "choices";

interface EnumOption<T = string> {
    icon?: Component;
    label: string;
    value: T;
}

interface FieldValueMap {        // length constraints
    number: { min?: number; max?: number };
    choice: { options: EnumOption[] };
    choices: { options: EnumOption[] };
}

type FilterField<T extends FieldType = FieldType> = {
    key: string;                          // matches the data key
    label: string;                        // human-readable name
    icon?: Component;        // icon component or icon name/class
    type: T;
} & (FieldValueMap[T] extends never
    ? { options?: never }
    : FieldValueMap[T]);

export interface FilterDefinition<TData extends Record<string, unknown> = Record<string, unknown>> {
  fields: FilterField[];
  /** Optionally enforce keys exist on the target data shape */
  _phantom?: TData;
}