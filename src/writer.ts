class NanoBufWriter {
	private readonly buffer: ArrayBuffer
	private dataView: DataView
	private textEncoder: TextEncoder

	/**
	 * The index at which new byte should be stored at.
	 * @private
	 */
	private endPtr = -1

	constructor(initialSizeInBytes: number) {
		this.endPtr = initialSizeInBytes
		this.buffer = new ArrayBuffer(initialSizeInBytes, {
			maxByteLength: 1024 * 1024,
		})
		this.dataView = new DataView(this.buffer)
		this.textEncoder = new TextEncoder("utf-8")
	}

	public get bytes(): Uint8Array {
		return new Uint8Array(this.buffer, 0, this.endPtr)
	}

	public writeTypeId(typeId: number) {
		this.dataView.setInt32(0, typeId, true)
	}

	public writeFieldSize(fieldNumber: number, size: number) {
		const offset = 4 * (fieldNumber + 1)
		this.dataView.setInt32(offset, size, true)
	}

	public appendBoolean(bool: boolean) {
		this.appendInt8(bool ? 1 : 0)
	}

	public appendInt8(int8: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 1)
		this.dataView.setInt8(offset, int8)
	}

	public appendInt32(int32: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 4)
		this.dataView.setInt32(offset, int32, true)
	}

	public appendDouble(double: number) {
		const offset = this.endPtr
		this.moveEndPtrAndResizeIfNecessary(offset + 8)
		this.dataView.setFloat64(offset, double, true)
	}

	public appendString(str: string): number {
		const bytes = this.textEncoder.encode(str)
		this.appendBytes(bytes)
		return bytes.byteLength
	}

	public appendStringAndSize(str: string): number {
		const bytes = this.textEncoder.encode(str)
		this.appendInt32(bytes.byteLength)
		this.appendBytes(bytes)
		return bytes.byteLength
	}

	public appendBytes(bytes: Uint8Array) {
		const offset = this.endPtr
		const byteLength = bytes.byteLength
		this.moveEndPtrAndResizeIfNecessary(offset + byteLength)
		for (let i = 0; i < byteLength; i++) {
			this.dataView.setUint8(offset + i, bytes.at(i)!)
		}
	}

	private moveEndPtrAndResizeIfNecessary(endPtr: number) {
		if (endPtr >= this.buffer.byteLength) {
			const difference = endPtr - this.buffer.byteLength
			this.buffer.resize(this.buffer.byteLength * 2 + difference)
		}
		this.endPtr = endPtr
	}
}

export { NanoBufWriter }
