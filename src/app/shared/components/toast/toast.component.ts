import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppMessageService } from '../../../core/services/app-message.service';

@Component({
  selector: 'fm-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  readonly messages = inject(AppMessageService);
}
