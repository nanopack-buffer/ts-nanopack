import { describe, expect, it } from "bun:test"
import { NanoBufReader } from "../reader"

function createArrayBuffer(bytes: number[]): Uint8Array {
	return new Uint8Array(bytes)
}

describe("NanoBuf Reader", () => {
	it("should read type id from a NanoPack-formatted buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 9, 6])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readTypeId()).toEqual(1)
	})

	it("should read sizes of fields from a NanoPack-formatted buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 0, 0, 9, 0, 0, 0])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readFieldSize(0)).toEqual(770)
		expect(reader.readFieldSize(1)).toEqual(9)
	})

	it("should read a boolean at the specified offset", () => {
		const testBuf = createArrayBuffer([0, 0, 0, 0, 1, 0])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readBoolean(4)).toBeTrue()
		expect(reader.readBoolean(3)).toBeFalse()
	})

	it("should read an int8 at the specified offset", () => {
		const testBuf = createArrayBuffer([0, 245, 96])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readInt8(1)).toEqual(-11)
		expect(reader.readInt8(2)).toEqual(96)
	})

	it("should read an int32 at the specified offset", () => {
		const testBuf = createArrayBuffer([0, 1, 0, 0, 128, 4, 5, 0, 0])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readInt32(5)).toEqual(1284)
		expect(reader.readInt32(1)).toEqual(-2147483647)
	})

	it("should read a double at the specified offset", () => {
		const testBuf = createArrayBuffer([
			0, 9, 0x29, 0x5c, 0x8f, 0xc2, 0xf5, 0x28, 0x1d, 0x40,
		])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readDouble(2)).toEqual(7.29)
	})

	it("should read a string at the specified offset", () => {
		const testBuf = createArrayBuffer([
			67, 89, 0x62, 0x72, 0x65, 0x61, 0x64, 0x20, 0xf0, 0x9f, 0x91, 0x8d,
		])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readString(2, 10)).toEqual("bread 👍")
	})
})
