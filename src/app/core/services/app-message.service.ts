import { Injectable, signal } from '@angular/core';

export type AppMessageTone = 'success' | 'info' | 'warning' | 'danger';

export interface AppMessage {
  id: number;
  text: string;
  tone: AppMessageTone;
}

@Injectable({ providedIn: 'root' })
export class AppMessageService {
  private readonly messageState = signal<AppMessage | null>(null);
  private messageId = 0;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  readonly message = this.messageState.asReadonly();

  show(text: string, tone: AppMessageTone = 'info'): void {
    this.messageState.set({ id: ++this.messageId, text, tone });

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    this.hideTimer = setTimeout(() => this.clear(), 3200);
  }

  clear(): void {
    this.messageState.set(null);
  }
}
