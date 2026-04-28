import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SignupRequest } from '../../../../core/models/auth.models';
import { AppMessageService } from '../../../../core/services/app-message.service';
import { AuthService } from '../../../../core/services/auth.service';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { GenericFormConfig } from '../../../../shared/components/generic-form/generic-form.models';

@Component({
  selector: 'fm-signup-page',
  standalone: true,
  imports: [GenericFormComponent, RouterLink],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(AppMessageService);

  readonly submitting = signal(false);
  readonly formConfig: GenericFormConfig = {
    title: 'Create Account',
    submitLabel: 'Create Account',
    fields: [
      {
        key: 'fullName',
        label: 'Full name',
        type: 'text',
        placeholder: 'Test User',
        autocomplete: 'name',
        validators: [Validators.required, Validators.maxLength(120)]
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'testuser@example.com',
        autocomplete: 'email',
        validators: [Validators.required, Validators.email, Validators.maxLength(180)]
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Password@123',
        autocomplete: 'new-password',
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(72)]
      }
    ]
  };

  submit(value: Record<string, unknown>): void {
    const request: SignupRequest = {
      fullName: String(value['fullName'] ?? ''),
      email: String(value['email'] ?? ''),
      password: String(value['password'] ?? '')
    };

    this.submitting.set(true);

    this.auth.signup(request).pipe(
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: () => {
        this.messages.show('Account created. You are signed in.', 'success');
        void this.router.navigateByUrl('/dashboard');
      },
      error: () => undefined
    });
  }
}
