interface NanoPackMessage {
	get typeId(): number

	bytes(): Uint8Array
}

export type { NanoPackMessage }
