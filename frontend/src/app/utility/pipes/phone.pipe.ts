import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
  googlePhone = PhoneNumberUtil.getInstance();

  transform(phoneValue: string, country: string = 'US'): string {
    try {
      return this.googlePhone.format(
        this.googlePhone.parse(phoneValue, country),
        PhoneNumberFormat.NATIONAL
      );
    } catch (error) {
      return phoneValue;
    }
  }
}
