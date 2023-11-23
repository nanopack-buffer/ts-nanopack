class NanoBufWriter {
	private buffer: Buffer

	/**
	 * The index at which new byte should be stored at.
	 * @private
	 */
	private endPtr = -1

	constructor(initialSizeInBytes: number) {
		this.endPtr = initialSizeInBytes
		this.buffer = Buffer.allocUnsafe(initialSizeInBytes)
	}

	public get bytes(): Uint8Array {
		return this.buffer.subarray(0, this.endPtr)
	}

	public writeTypeId(typeId: number) {
		this.buffer.writeInt32LE(typeId, 0)
	}

	public writeFieldSize(fieldNumber: number, size: number) {
		this.buffer.writeInt32LE(size, 4 * (fieldNumber + 1))
	}

	public appendBoolean(bool: boolean) {
		this.appendInt8(bool ? 1 : 0)
	}

	public appendInt8(int8: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 1)
		this.buffer.writeInt8(int8, offset)
	}

	public appendInt32(int32: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 4)
		this.buffer.writeInt32LE(int32, offset)
	}

	public appendDouble(double: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.buffer.writeDoubleLE(double, offset)
	}

	public appendString(str: string): number {
		const buf = Buffer.from(str, "utf-8")
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + buf.byteLength)
		this.buffer.copy(buf, offset)
		return buf.byteLength
	}

	public appendStringAndSize(str: string): number {
		const buf = Buffer.from(str, "utf-8")
		this.appendInt32(buf.byteLength)
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + buf.byteLength)
		this.buffer.copy(buf, offset)
		return buf.byteLength
	}

	public appendBytes(bytes: Uint8Array) {
		const offset = this.endPtr
		const byteLength = bytes.byteLength
		this.moveEndPtrAndResizeIfNecessary(offset + byteLength)
		this.buffer.copy(bytes, offset)
	}

	private moveEndPtrAndResizeIfNecessary(endPtr: number) {
		const currentLength = this.buffer.byteLength
		if (endPtr >= currentLength) {
			const difference = endPtr - this.buffer.byteLength
			const newBuf = Buffer.allocUnsafe(this.buffer.byteLength * 2 + difference)
			this.buffer.copy(newBuf)
			this.buffer = newBuf
		}
		this.endPtr = endPtr
	}
}

export { NanoBufWriter }
