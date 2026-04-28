import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonTone = 'primary' | 'ghost' | 'neutral' | 'danger';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'fm-button',
  standalone: true,
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppButtonComponent {
  readonly type = input<ButtonType>('button');
  readonly tone = input<ButtonTone>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly clicked = output<MouseEvent>();
}
