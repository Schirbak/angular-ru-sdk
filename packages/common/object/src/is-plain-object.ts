import { Any, Fn } from '@angular-ru/common/typings';

import { instanceOfPlainObject } from './internal/instance-of-plain-object';

export function isPlainObject(plainObject: Any): boolean {
    let constructorRef: Fn;
    let prototypeRef: Fn;

    if (!instanceOfPlainObject(plainObject)) {
        return false;
    }

    // If has modified constructor
    // eslint-disable-next-line @typescript-eslint/tslint/config,prefer-const
    constructorRef = plainObject.constructor as Any;
    if (constructorRef === undefined) {
        return true;
    }

    // If has modified prototype
    // eslint-disable-next-line @typescript-eslint/tslint/config,prefer-const
    prototypeRef = constructorRef.prototype as Any;
    if (!instanceOfPlainObject(prototypeRef)) {
        return false;
    }

    // If constructor does not have an Object-specific method
    if (!prototypeRef.hasOwnProperty('isPrototypeOf')) {
        return false;
    }

    // Most likely a plain Object
    return true;
}
