// expect errors
import { B1 } from './module/b1';
import { A1 } from './module/a1';
import { C1 } from './module/c1';

export class A {
    // expect errors
    public hi: number = 2;
    // expect errors
    hello = 1;
}

// eslint-disable-next-line no-console
console.log(new A().hello);
// eslint-disable-next-line no-console
console.log(new A().hi);

// expect errors
export enum foo {
    SECOND = 1000,
    VALUE_1 = 3,
    VALUE_2 = 4
}

// expect errors
export const enum HELLO {
    WORLD
}

console.error(foo.SECOND);
console.error(foo.VALUE_1);
console.error(foo.VALUE_2);
console.error(HELLO.WORLD);

// expect no errors
const helloWorld: Function = async function (): Promise<string> {
    return 'Hello world';
};

// expect no errors
helloWorld();

const helloWorldAsync: Function = async (): Promise<string> => 'Hello world';
await helloWorldAsync();

// expect no errors
function helloWorldNamed(): string {
    return 'Hello world';
}

// expect no errors
helloWorldNamed();

// expect errors
console.error(5 * 10);

// expect errors
export abstract class TestClass {}

// expect errors
console.log(TestClass);

console.warn(new A1());
console.warn(new B1().hello(1));
console.warn(new B1().hello('hello'));
console.warn(new C1());

/****
 * Test code
 * @typescript-eslint/no-useless-constructor
 */
class G {
    constructor(public value: string) {}
}

class D extends G {
    // expect errors
    constructor(value: string) {
        super(value);
    }
}

const dx: D = new D('123');

// eslint-disable-next-line no-console
console.log(dx.value);

// space before
function f (): void {
    // hello
}

f();

// expect errors
class little {}

const little1: little = new little();
// eslint-disable-next-line no-console
console.log(little1);

// expect errors
class Little_Bar {}

const little2: little = new Little_Bar();
// eslint-disable-next-line no-console
console.log(little2);

// expect interface errors
interface myType {
    a: string;
}

const m1: myType = { a: 'ast' };
// eslint-disable-next-line no-console
console.log(m1);

// expect interface errors
type alist = { b: string } & { c: string };

const m2: alist = { b: '1', c: '2' };
// eslint-disable-next-line no-console
console.log(m2);

(function f1(a: number, b: number, c: number, d: number): void {
    console.error(a, b, c, d);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
})(1, 2, 3, 4);

(function f2(a: number, b: number): void {
    console.error(a, b);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
})(1, 2);

((a: number, b: number, c: number, d: number): void => {
    console.error(a, b, c, d);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
})(1, 2, 3, 4);

((a: number, b: number): void => {
    console.error(a, b);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
})(1, 2);

class TestMaxParams {
    public f3(a: number, b: number, c: number, d: number): void {
        console.error(a, b, c, d);
    }

    public f4(a: number, b: number): void {
        console.error(a, b);
    }
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
new TestMaxParams().f3(1, 2, 3, 4);

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
new TestMaxParams().f4(1, 2);
