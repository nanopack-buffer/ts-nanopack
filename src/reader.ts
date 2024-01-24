class NanoBufReader {
	private readonly buffer: Buffer

	constructor(data: Uint8Array) {
		this.buffer = Buffer.from(data)
	}

	public get bytes() {
		return this.buffer
	}

	/**
	 * Creates a new instance of {@link NanoBufReader} that can only read a portion of the buffer of this reader.
	 * From the created {@link NanoBufReader}'s point-of-view, the zero index will be the given start index, and the last index the given end index.
	 * The buffer is not copied when creating the new reader.
	 *
	 * @param start The index at which the portion of the buffer starts (inclusive)
	 * @param end The index at which the portion of the buffer ends (exclusive)
	 * @return A new {@link NanoBufReader} that has access to a slice of the buffer that backs this reader within the range [start, end).
	 */
	public newReaderAt(start: number, end?: number): NanoBufReader {
		return new NanoBufReader(this.buffer.subarray(start, end))
	}

	/**
	 * Returns a slice of the buffer that backs this reader. No copying is involved
	 *
	 * @param start The index at which the slice starts (inclusive)
	 * @param end The index at which the slice ends (exclusive)
	 * @return a slice of the buffer that backs this reader.
	 */
	public slice(start: number, end?: number): Uint8Array {
		return this.buffer.subarray(start, end)
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

	public readInt64(offset: number): bigint {
		return this.buffer.readBigInt64LE(offset)
	}

	public readDouble(offset: number): number {
		return this.buffer.readDoubleLE(offset)
	}

	public readString(offset: number, size: number): string {
		return this.buffer.toString("utf-8", offset, offset + size)
	}
}

export { NanoBufReader }
