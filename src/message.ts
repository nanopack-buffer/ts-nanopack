interface NanoPackMessage {
	get typeId(): number

	bytes(withLengthPrefix?: boolean): Uint8Array
}

export type { NanoPackMessage }
