import { MethodArgsRegistry } from '@angular-ru/common/runtime';
import { Any, Fn } from '@angular-ru/common/typings';

import { ensureMethodArgsRegistry } from './internal/ensure-method-args-registry';
import { KEY_REQUEST_BODY, META_REQUEST_BODY } from './internal/meta-keys.config';

// eslint-disable-next-line max-lines-per-function
export function RequestBody(): ParameterDecorator {
    return (target: Any, methodName: string | symbol, parameterIndex: number): void => {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const originalMethod: Fn = (target as Any)?.[methodName as Any];
        const registry: MethodArgsRegistry = ensureMethodArgsRegistry(originalMethod, META_REQUEST_BODY);
        registry.putIndexByName(KEY_REQUEST_BODY, methodName as string, parameterIndex);
    };
}
