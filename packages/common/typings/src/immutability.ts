// eslint-disable-next-line @typescript-eslint/ban-types
export type PrimitiveType = undefined | null | boolean | string | number | Function;

export type Immutable<T> = { readonly [K in keyof T]: T[K] extends PrimitiveType ? T[K] : Immutable<T[K]> };

export type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
