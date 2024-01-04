class NanoBufWriter {
	private buffer: Buffer

	private messageOffset = 0

	/**
	 * The index at which new byte should be stored at.
	 * @private
	 */
	private endPtr = -1

	constructor(initialSizeInBytes: number, lengthPrefix: boolean = false) {
		this.endPtr = initialSizeInBytes
		this.buffer = Buffer.allocUnsafe(initialSizeInBytes)
		if (lengthPrefix) {
			this.messageOffset = 4
		}
	}

	public get currentSize() {
		return this.endPtr
	}

	public get bytes(): Uint8Array {
		return this.buffer.subarray(0, this.endPtr)
	}

	public writeTypeId(typeId: number) {
		this.buffer.writeInt32LE(typeId, this.messageOffset)
	}

	public writeLengthPrefix(length: number) {
		this.buffer.writeInt32LE(length, 0)
	}

	public writeFieldSize(fieldNumber: number, size: number) {
		this.buffer.writeInt32LE(size, this.messageOffset + 4 * (fieldNumber + 1))
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

	public appendInt64(int64: bigint) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.buffer.writeBigInt64LE(int64, offset)
	}

	public appendDouble(double: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.buffer.writeDoubleLE(double, offset)
	}

	public appendString(str: string): number {
		const strByteLength = Buffer.byteLength(str, "utf-8")
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + strByteLength)
		this.buffer.write(str, offset, "utf-8")
		return strByteLength
	}

	public appendStringAndSize(str: string): number {
		const strByteLength = Buffer.byteLength(str, "utf-8")
		this.appendInt32(strByteLength)
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + strByteLength)
		this.buffer.write(str, offset, "utf-8")
		return strByteLength
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
