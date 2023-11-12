import { describe, expect, it } from "bun:test"
import { NanoBufWriter } from "../writer.ts"

describe("NanoBuf writer", () => {
	it("should write the given type id at the beginning of the buffer in little endian format", () => {
		const writer = new NanoBufWriter(1)
		writer.writeTypeId(4)
		expect([...new Uint8Array(writer.bytes)]).toEqual([4, 0, 0, 0])
	})

	it("should write the given size of a field at the correct position in the buffer in little endian format", () => {
		const writer = new NanoBufWriter(3)
		writer.writeFieldSize(0, 8)
		expect([...new Uint8Array(writer.bytes)]).toEqual([0, 0, 0, 0, 8, 0, 0, 0])
	})

	it("should append the given boolean to the end of the buffer", () => {
		const writer = new NanoBufWriter(10)
		writer.writeTypeId(4)
		writer.writeFieldSize(0, 1)

		writer.appendBoolean(true)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			4, 0, 0, 0, 1, 0, 0, 0, 1,
		])

		writer.appendBoolean(false)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			4, 0, 0, 0, 1, 0, 0, 0, 1, 0,
		])
	})

	it("should append the given int8 to the end of the buffer", () => {
		const writer = new NanoBufWriter(10)
		writer.writeTypeId(10)
		writer.writeFieldSize(0, 1)

		writer.appendInt8(78)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			10, 0, 0, 0, 1, 0, 0, 0, 78,
		])

		writer.appendInt8(-45)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			10, 0, 0, 0, 1, 0, 0, 0, 78, 0xd3,
		])
	})

	it("should append the given int32 to the end of the buffer in little endian format", () => {
		const writer = new NanoBufWriter(10)
		writer.writeTypeId(8)
		writer.writeFieldSize(0, -1)

		writer.appendInt32(2345)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			8, 0, 0, 0, 255, 255, 255, 255, 0b00101001, 0b00001001, 0, 0,
		])

		writer.appendInt32(-128)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			8, 0, 0, 0, 255, 255, 255, 255, 0b00101001, 0b00001001, 0, 0, 128, 255,
			255, 255,
		])
	})

	it("should append the given double to the end of the buffer in little endian format", () => {
		const writer = new NanoBufWriter(10)
		writer.writeTypeId(8)
		writer.writeFieldSize(0, -1)

		writer.appendDouble(9.8)
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			8, 0, 0, 0, 255, 255, 255, 255, 0x9a, 0x99, 0x99, 0x99, 0x99, 0x99, 0x23,
			0x40,
		])
	})

	it("should append the given string to the end of the buffer in UTF-8", () => {
		const writer = new NanoBufWriter(10)
		writer.writeTypeId(8)
		writer.writeFieldSize(0, -1)

		writer.appendString("hello world")
		expect([...new Uint8Array(writer.bytes)]).toEqual([
			8, 0, 0, 0, 255, 255, 255, 255, 0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x77,
			0x6F, 0x72, 0x6C, 0x64,
		])
	})
})
