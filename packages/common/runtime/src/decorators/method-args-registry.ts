import { InvalidArgsNamesException } from '../exceptions/invalid-args-names.exception';

export interface MethodArgsRegistryMeta {
    key: string;
    index: number;
}

export class MethodArgsRegistry {
    private argumentsIndexMap: Map<number | string, MethodArgsRegistryMeta> = new Map();

    public get size(): number {
        return this.argumentsIndexMap.size;
    }

    public getNameByIndex(index: number): string | null {
        return this.argumentsIndexMap.get(index)?.key ?? null;
    }

    public getIndexByKey(key: string): number | null {
        return this.argumentsIndexMap.get(key)?.index ?? null;
    }

    public putIndexByName(name: string, method: string, paramIndex: number): void {
        const info: MethodArgsRegistryMeta = { key: name, index: paramIndex };
        this.checkDuplicateName(name, method);
        this.argumentsIndexMap.set(paramIndex, info);
        this.argumentsIndexMap.set(name, info);
    }

    private checkDuplicateName(name: string, method: string): void | never {
        if (this.argumentsIndexMap.has(name)) {
            throw new InvalidArgsNamesException(name, method);
        }
    }
}
