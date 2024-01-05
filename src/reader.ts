class NanoBufReader {
	private readonly _buffer: Buffer

	constructor(data: Uint8Array) {
		this._buffer = Buffer.from(data)
	}

	public get buffer() {
		return this._buffer
	}

	public readTypeId(): number {
		return this._buffer.readInt32LE(0)
	}

	public readFieldSize(fieldNumber: number): number {
		return this._buffer.readInt32LE(4 * (fieldNumber + 1))
	}

	public readBoolean(offset: number): boolean {
		return this._buffer.readInt8(offset) === 1
	}

	public readInt8(offset: number): number {
		return this._buffer.readInt8(offset)
	}

	public readInt32(offset: number): number {
		return this._buffer.readInt32LE(offset)
	}

	public readInt64(offset: number): bigint {
		return this._buffer.readBigInt64LE(offset)
	}

	public readDouble(offset: number): number {
		return this._buffer.readDoubleLE(offset)
	}

	public readString(offset: number, size: number): string {
		return this._buffer.toString("utf-8", offset, offset + size)
	}
}

export { NanoBufReader }
