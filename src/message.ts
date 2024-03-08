import type { NanoBufWriter } from "./writer.js"

interface NanoPackMessage {
	get typeId(): number

	get headerSize(): number

	writeTo(writer: NanoBufWriter, offset: number): number

	bytes(): Uint8Array
}

export type { NanoPackMessage }
