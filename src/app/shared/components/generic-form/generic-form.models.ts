import { ValidatorFn } from '@angular/forms';

export type GenericFieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';

export interface GenericFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface GenericFormField {
  key: string;
  label: string;
  type: GenericFieldType;
  placeholder?: string;
  defaultValue?: unknown;
  options?: GenericFieldOption[];
  validators?: ValidatorFn[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  autocomplete?: string;
}

export interface GenericFormConfig {
  title?: string;
  submitLabel: string;
  cancelLabel?: string;
  fields: GenericFormField[];
}
