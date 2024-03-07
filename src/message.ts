interface NanoPackMessage {
	get typeId(): number

	get headerSize(): number

	bytesWithLengthPrefix(): Uint8Array

	bytes(): Uint8Array
}

export type { NanoPackMessage }
