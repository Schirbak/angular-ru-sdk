#### `@angular-ru/common/string`

-   `capitalize`

```ts
console.log(capitalize('hello world')); // Hello world
```

-   `stringify`

```ts
stringify({ a: 1, b: { c: 2 } }); // pretty print
```

-   `toStringVal(value: T, converter?: (val: T) => string)`

```ts
let value: string = toStringVal([1, 2, 3]); // "1,2,3"
value = toStringVal([1, 2, 3], (values: string[]) => values.join('; ')); // "1; 2; 3"
```

-   `getByteSize(val: string)`

```ts
expect(getByteSize('сын')).toEqual(6);
expect(getByteSize('son')).toEqual(3);
```

-   `splitOnUniqueValues`

```ts
expect(splitOnUniqueValues('1; 2; 3, 5.6;   ;, ; 3, 6, 2; 1; -52; 0')).toEqual(['1', '2', '3', '5.6', '6', '-52', '0']);
expect(splitOnUniqueValues('1 - 2 - 3 - 3 - 2 - 1', /-/g)).toEqual(['1', '2', '3']);
```

-   `generateQuickGuid`

```ts
console.log(generateQuickGuid()); // udn0la1mhfq4tudhnympq
```

-   `isString`

```ts
expect(isString('')).toEqual(true);
expect(isString(0)).toEqual(false);
expect(isString(NaN)).toEqual(false);
expect(isString(Infinity)).toEqual(false);
expect(isString(null)).toEqual(false);
expect(isString(undefined)).toEqual(false);
```

-   `trim`

```ts
expect(trim('test ')).toEqual('test');
expect(trim('      test  ')).toEqual('test');
expect(trim('   test  test  ')).toEqual('test  test');
```
