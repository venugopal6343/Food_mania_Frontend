import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency',
  standalone: true
})
export class InrCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, currency = 'INR'): string {
    const numericValue = Number(value ?? 0);

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
  }
}
