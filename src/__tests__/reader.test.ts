import { describe, expect, it } from "bun:test"
import { NanoBufReader } from "../reader.js"

function createArrayBuffer(bytes: number[]): Buffer {
	return Buffer.from(bytes)
}

describe("NanoBuf Reader", () => {
	it("should read type id from a NanoPack-formatted buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 9, 6])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readTypeId()).toEqual(1)
	})

	it("should provide access to the backing buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 9, 6])
		const reader = new NanoBufReader(testBuf)
		expect([...reader.bytes]).toEqual([1, 0, 0, 0, 2, 3, 9, 6])
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

	it("should read an int64 at the specified offset", () => {
		const testBuf = createArrayBuffer([
			0, 0, 0, 0, 0, 0, 0, 0, 128, 4, 5, 0, 0, 0, 0, 0,
		])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readInt64(1)).toEqual(-9223372036854775808n)
		expect(reader.readInt64(8)).toEqual(328832n)
	})

	it("should read a uint8 at the specified offset", () => {
		const testBuf = createArrayBuffer([0, 245, 96])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readUint8(0)).toEqual(0)
		expect(reader.readUint8(1)).toEqual(245)
		expect(reader.readUint8(2)).toEqual(96)
	})

	it("should read a uint32 at the specified offset", () => {
		const testBuf = createArrayBuffer([255, 255, 255, 255, 128, 4, 5, 0, 0])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readUint32(0)).toEqual(4294967295)
		expect(reader.readUint32(5)).toEqual(1284)
	})

	it("should read a uint64 at the specified offset", () => {
		const testBuf = createArrayBuffer([
			255, 255, 255, 255, 255, 255, 255, 255, 128, 4, 5, 0, 0, 0, 0, 0,
		])
		const reader = new NanoBufReader(testBuf)
		expect(reader.readUint64(0)).toEqual(18446744073709551615n)
		expect(reader.readUint64(8)).toEqual(328832n)
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

	it("should be able to create a new instance of itself that has access to a slice of the backing buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 0, 0, 9, 0, 0, 0])
		const reader = new NanoBufReader(testBuf)
		const newReader = reader.newReaderAt(5, 8)
		expect([...newReader.slice(0)]).toEqual([3, 0, 0])
	})

	it("should be able to create a slice of the backing buffer", () => {
		const testBuf = createArrayBuffer([1, 0, 0, 0, 2, 3, 0, 0, 9, 0, 0, 0])
		const reader = new NanoBufReader(testBuf)
		expect([...reader.slice(5, 8)]).toEqual([3, 0, 0])
	})
})
