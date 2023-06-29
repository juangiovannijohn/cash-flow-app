import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function sqlInjectionValidator(sqlInjectionRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const containsSqlInjection = sqlInjectionRe.test(control.value);
    const errorMessage = 'No se permiten los siguientes caracteres: \' " ; --';
  
    return containsSqlInjection ? { sqlInjection: { value: control.value, message: errorMessage } } : null;
  };
}