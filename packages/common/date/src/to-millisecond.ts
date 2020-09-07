import { toNumber } from '@angular-ru/common/number';
import { Timestamp } from '@angular-ru/common/typings';

export function toMilliseconds(seconds: Timestamp): number {
    if (seconds instanceof Date) {
        return seconds.getTime();
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return toNumber(seconds?.toString()) * 1000;
}
