import { MethodArgsRegistry } from '@angular-ru/common/runtime';
import { Any, Fn } from '@angular-ru/common/typings';

export function getMethodArgsRegistry(method: Fn, metaKey: string): MethodArgsRegistry | null {
    // eslint-disable-next-line @typescript-eslint/tslint/config
    return (method as Any)?.[metaKey] ?? null;
}
