import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TableAction, TableActionEvent, TableColumn } from './generic-table.models';

type TableRow = Record<string, unknown>;

@Component({
  selector: 'fm-generic-table',
  standalone: true,
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent<T extends TableRow = TableRow> {
  readonly columns = input<TableColumn<T>[]>([]);
  readonly data = input<T[]>([]);
  readonly actions = input<TableAction<T>[]>([]);
  readonly loading = input(false);
  readonly emptyLabel = input('No records found.');
  readonly trackByKey = input<string>('id');
  readonly rowAction = output<TableActionEvent<T>>();

  readonly columnCount = computed(() => this.columns().length + (this.actions().length > 0 ? 1 : 0));

  cell(row: T, column: TableColumn<T>): string {
    const value = row[String(column.key)];
    return column.formatter ? column.formatter(value, row) : String(value ?? '');
  }

  alignClass(align = 'start'): string {
    return `align-${align}`;
  }

  trackRow(index: number, row: T): unknown {
    return row[this.trackByKey()] ?? index;
  }
}
