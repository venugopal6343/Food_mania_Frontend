export type TableAlign = 'start' | 'center' | 'end';

export interface TableColumn<T extends Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  align?: TableAlign;
  width?: string;
  sortable?: boolean;
  formatter?: (value: unknown, row: T) => string;
}

export interface TableAction<T extends Record<string, unknown>> {
  id: string;
  label: string;
  tone?: 'primary' | 'neutral' | 'danger';
  disabled?: (row: T) => boolean;
}

export interface TableActionEvent<T extends Record<string, unknown>> {
  actionId: string;
  row: T;
}
