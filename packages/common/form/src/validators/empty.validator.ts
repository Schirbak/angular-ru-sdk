import { PlainObject } from '@angular-ru/common/typings';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export type EmptyValidatorFn = (control: FormGroup) => ValidationErrors | null;

export const emptyValidator: EmptyValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const filterData: PlainObject = control.controls;
    const values: FormControl[] = Object.values(filterData);
    const formValues: string[] = values.map((elem: FormControl): string => elem.value?.toString().trim());
    const validFormValues: string[] = formValues.filter((value: string): string => value);
    return validFormValues.length === 0 ? { empty: true } : null;
};
