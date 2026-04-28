import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { GenericFormConfig, GenericFormField } from './generic-form.models';

@Component({
  selector: 'fm-generic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericFormComponent {
  readonly config = input<GenericFormConfig>({
    submitLabel: 'Submit',
    fields: []
  });
  readonly initialValue = input<Record<string, unknown>>({});
  readonly submitting = input(false);
  readonly formSubmit = output<Record<string, unknown>>();
  readonly formCancel = output<void>();
  readonly form = signal(new UntypedFormGroup({}));

  constructor() {
    effect(() => {
      const config = this.config();
      const initialValue = this.initialValue();
      const controls = config.fields.reduce<Record<string, UntypedFormControl>>((group, field) => {
        group[field.key] = new UntypedFormControl(
          initialValue[field.key] ?? field.defaultValue ?? this.defaultValue(field),
          field.validators ?? []
        );
        return group;
      }, {});

      this.form.set(new UntypedFormGroup(controls));
    });
  }

  submit(): void {
    const form = this.form();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(form.getRawValue() as Record<string, unknown>);
  }

  errorFor(key: string): string {
    const control = this.form().get(key);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['email']) {
      return 'Enter a valid email address.';
    }

    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength}.`;
    }

    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength}.`;
    }

    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}.`;
    }

    if (control.errors['max']) {
      return `Maximum value is ${control.errors['max'].max}.`;
    }

    return 'Invalid value.';
  }

  private defaultValue(field: GenericFormField): unknown {
    return field.type === 'checkbox' ? false : '';
  }
}
