import { Any } from '@angular-ru/common/typings';

import { EncodingType } from './encoding-type.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const DecompressionStream: Any;

export async function decompress(bytes: ArrayBuffer, encoding: EncodingType = EncodingType.DEFLATE): Promise<string> {
    const decompressionStream: Any = new DecompressionStream(encoding);
    const writable: WritableStream = decompressionStream.writable;
    const writer: WritableStreamDefaultWriter = writable.getWriter();

    // noinspection ES6MissingAwait
    writer.write(bytes);

    // noinspection ES6MissingAwait
    writer.close();

    const arrayBuffer: ArrayBuffer = await new Response(decompressionStream.readable).arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
}
