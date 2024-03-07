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

	public get currentSize() {
		return this.endPtr
	}

	public get bytes(): Uint8Array {
		return this.buffer.subarray(0, this.endPtr)
	}

	public allocMore(bytes: number) {
		const newBuf = Buffer.allocUnsafe(this.buffer.byteLength + bytes)
		this.buffer.copy(newBuf)
		this.buffer = newBuf
		this.endPtr += bytes
	}

	public writeTypeId(typeId: number, offset: number = 0) {
		this.buffer.writeUInt32LE(typeId, offset)
	}

	public writeFieldSize(fieldNumber: number, size: number, offset: number = 0) {
		this.buffer.writeInt32LE(size, offset + 4 * (fieldNumber + 1))
	}

	public appendBoolean(bool: boolean) {
		this.appendInt8(bool ? 1 : 0)
	}

	public appendInt8(int8: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 1)
		this.buffer.writeInt8(int8, offset)
	}

	public appendUint8(uint8: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 1)
		this.buffer.writeUint8(uint8, offset)
	}

	public appendInt32(int32: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 4)
		this.buffer.writeInt32LE(int32, offset)
	}

	public appendUint32(uint32: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 4)
		this.buffer.writeUInt32LE(uint32, offset)
	}

	public appendInt64(int64: bigint) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.buffer.writeBigInt64LE(int64, offset)
	}

	public appendUint64(uint64: bigint) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.buffer.writeBigUInt64LE(uint64, offset)
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
		this.buffer.set(bytes, offset)
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
