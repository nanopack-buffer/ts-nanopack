class NanoBufReader {
	private dataView: DataView
	private uint8View: Uint8Array
	private textDecoder: TextDecoder

	constructor(buffer: ArrayBuffer) {
		this.textDecoder = new TextDecoder("utf-8")
		this.dataView = new DataView(buffer)
		this.uint8View = new Uint8Array(buffer)
	}

	public readTypeId(): number {
		return this.dataView.getInt32(0, true)
	}

	public readFieldSize(fieldNumber: number): number {
		return this.dataView.getInt32(4 * (fieldNumber + 1), true)
	}

	public readBoolean(offset: number): boolean {
		return this.dataView.getUint8(offset) === 1
	}

	public readInt8(offset: number): number {
		return this.dataView.getInt8(offset)
	}

	public readInt32(offset: number): number {
		return this.dataView.getInt32(offset, true)
	}

	public readDouble(offset: number): number {
		return this.dataView.getFloat64(offset, true)
	}

	public readString(offset: number, size: number): string {
		return this.textDecoder.decode(
			this.uint8View.subarray(offset, offset + size),
		)
	}
}

export { NanoBufReader }
