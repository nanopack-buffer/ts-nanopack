class NanoBufReader {
	private buffer: Buffer

	constructor(data: Uint8Array) {
		this.buffer = Buffer.from(data)
	}

	public readTypeId(): number {
		return this.buffer.readInt32LE(0)
	}

	public readFieldSize(fieldNumber: number): number {
		return this.buffer.readInt32LE(4 * (fieldNumber + 1))
	}

	public readBoolean(offset: number): boolean {
		return this.buffer.readInt8(offset) === 1
	}

	public readInt8(offset: number): number {
		return this.buffer.readInt8(offset)
	}

	public readInt32(offset: number): number {
		return this.buffer.readInt32LE(offset)
	}

	public readDouble(offset: number): number {
		return this.buffer.readDoubleLE(offset)
	}

	public readString(offset: number, size: number): string {
		return this.buffer.toString("utf-8", offset, offset + size)
	}
}

export { NanoBufReader }
