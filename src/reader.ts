class NanoBufReader {
	private buffer: Uint8Array
	private textDecoder: TextDecoder

	constructor(data: Uint8Array) {
		this.textDecoder = new TextDecoder("utf-8")
		this.buffer = data
	}

	public readTypeId(): number {
		return this.readInt32(0)
	}

	public readFieldSize(fieldNumber: number): number {
		return this.readInt32(4 * (fieldNumber + 1))
	}

	public readBoolean(offset: number): boolean {
		return this.buffer[offset] === 1
	}

	public readInt8(offset: number): number {
		const b = this.buffer[offset]
		return b < 128 ? b : -(256 - b)
	}

	public readInt32(offset: number): number {
		return (
			this.buffer[offset] |
			(this.buffer[offset + 1] << 8) |
			((this.buffer[offset + 2] << 16) | (this.buffer[offset + 3] << 24))
		)
	}

	public readDouble(offset: number): number {
		return new Float64Array(this.buffer.subarray(offset, offset + 8)).at(0)!
	}

	public readString(offset: number, size: number): string {
		return this.textDecoder.decode(this.buffer.subarray(offset, offset + size))
	}
}

export { NanoBufReader }
