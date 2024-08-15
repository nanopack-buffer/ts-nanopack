import { describe, expect, it } from "bun:test"
import { InMemoryRpcChannel } from "../rpc/in-memory-channel.js"
import { RpcClient } from "../rpc/rpc-client.js"
import { RpcServer } from "../rpc/rpc-server.js"
import { NanoBufWriter } from "../writer.js"
import { RpcMessageType } from "../rpc/message-type.js"
import type { RpcServerChannel } from "../rpc/rpc-channel.js"

class TestRpcClient extends RpcClient {
	async add(a: number, b: number): Promise<number> {
		const writer = new NanoBufWriter(16, false)
		const msgId = this.newMessageId()
		writer.appendUint8(RpcMessageType.REQUEST)
		writer.appendUint32(msgId)
		writer.appendStringAndSize("add")
		writer.appendInt32(a)
		writer.appendInt32(b)
		const resultReader = await this.sendRequestData(msgId, writer.bytes)
		let ptr = 5
		const errFlag = resultReader.readUint8(ptr++)
		if (errFlag) {
			throw new Error("error")
		}
		const result = resultReader.readInt32(ptr)
		ptr += 4
		return result
	}
}

class TestRpcServer extends RpcServer {
	constructor(channel: RpcServerChannel) {
		super(channel)

		this.on("add", (reader, offset, msgId) => {
			let ptr = offset
			const a = reader.readInt32(ptr)
			ptr += 4
			const b = reader.readInt32(ptr)
			ptr += 4
			const result = a + b
			const writer = new NanoBufWriter(10, false)
			writer.appendUint8(RpcMessageType.RESPONSE)
			writer.appendUint32(msgId)
			writer.appendUint8(0)
			writer.appendInt32(result)
			return writer
		})
	}
}

describe("RPC", () => {
	it("works with in memory channel", async () => {
		const channel = new InMemoryRpcChannel()
		const client = new TestRpcClient(channel)
		const server = new TestRpcServer(channel)

		const result = await client.add(4, 6)
		expect(result).toEqual(10)
	})
})
