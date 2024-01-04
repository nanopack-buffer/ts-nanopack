interface NanoPackMessage {
	get typeId(): number

	bytesWithLengthPrefix(): Uint8Array

	bytes(): Uint8Array
}

export type { NanoPackMessage }
