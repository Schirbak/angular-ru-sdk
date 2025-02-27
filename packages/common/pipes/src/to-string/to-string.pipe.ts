import { toStringVal } from '@angular-ru/common/string';
import { isNotNil } from '@angular-ru/common/utils';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toString' })
export class ToStringPipe implements PipeTransform {
    public transform<T>(value: T, converter?: (value: T) => string): string {
        return isNotNil(value) ? toStringVal(value, converter) : '';
    }
}
