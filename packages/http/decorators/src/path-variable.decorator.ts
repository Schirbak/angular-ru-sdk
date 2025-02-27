import { MethodArgsRegistry } from '@angular-ru/common/runtime';
import { Any, Fn } from '@angular-ru/common/typings';

import { ensureMethodArgsRegistry } from './internal/ensure-method-args-registry';
import { META_PATH_VARIABLE } from './internal/meta-keys.config';

// eslint-disable-next-line max-lines-per-function
export function PathVariable(name: string): ParameterDecorator {
    return (target: Any, methodName: string | symbol, parameterIndex: number): void => {
        const key: string = name.trim();

        if (!key) {
            throw new Error(`@PathVariable name should be initialized`);
        }

        // eslint-disable-next-line @typescript-eslint/tslint/config
        const originalMethod: Fn = (target as Any)?.[methodName as Any];
        const registry: MethodArgsRegistry = ensureMethodArgsRegistry(originalMethod, META_PATH_VARIABLE);
        registry.putIndexByName(key, methodName as string, parameterIndex);
    };
}
