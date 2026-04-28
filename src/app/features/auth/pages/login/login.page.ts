import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LoginRequest } from '../../../../core/models/auth.models';
import { AppMessageService } from '../../../../core/services/app-message.service';
import { AuthService } from '../../../../core/services/auth.service';
import { GenericFormComponent } from '../../../../shared/components/generic-form/generic-form.component';
import { GenericFormConfig } from '../../../../shared/components/generic-form/generic-form.models';

@Component({
  selector: 'fm-login-page',
  standalone: true,
  imports: [GenericFormComponent, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(AppMessageService);

  readonly submitting = signal(false);
  readonly formConfig: GenericFormConfig = {
    title: 'Login',
    submitLabel: 'Sign In',
    fields: [
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'user@foodmanians.com',
        autocomplete: 'email',
        validators: [Validators.required, Validators.email]
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'User@12345',
        autocomplete: 'current-password',
        validators: [Validators.required]
      }
    ]
  };

  readonly seedUser = {
    email: 'user@foodmanians.com',
    password: 'User@12345'
  };

  readonly seedAdmin = {
    email: 'admin@foodmanians.com',
    password: 'Admin@12345'
  };

  submit(value: Record<string, unknown>): void {
    const request: LoginRequest = {
      email: String(value['email'] ?? ''),
      password: String(value['password'] ?? '')
    };

    this.signIn(request);
  }

  quickLogin(kind: 'user' | 'admin'): void {
    this.signIn(kind === 'admin' ? this.seedAdmin : this.seedUser);
  }

  private signIn(request: LoginRequest): void {
    this.submitting.set(true);

    this.auth.login(request).pipe(
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: () => {
        this.messages.show('Signed in successfully.', 'success');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: () => undefined
    });
  }
}
