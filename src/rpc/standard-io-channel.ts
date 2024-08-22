import * as fs from "node:fs"
import { NanoBufReader } from "../reader.js"
import { RpcMessageType } from "./message-type.js"
import type { RpcClientChannel, RpcServerChannel } from "./rpc-channel.js"

class NodeStandardIoRpcChannel implements RpcServerChannel, RpcClientChannel {
	private requestHandler: ((requestReader: NanoBufReader) => void) | null = null
	private responseHandler: ((responseReader: NanoBufReader) => void) | null =
		null

	private isClosed = false

	sendRequestData(data: Uint8Array): void {
		const sizeBuf = Buffer.allocUnsafe(4)
		sizeBuf.writeUint32LE(data.byteLength)
		process.stdout.write(sizeBuf)
		process.stdout.write(data)
	}

	onResponse(responseHandler: (responseReader: NanoBufReader) => void): void {
		this.responseHandler = responseHandler
	}

	sendResponseData(data: Uint8Array): void {
		const sizeBuf = Buffer.allocUnsafe(4)
		sizeBuf.writeUint32LE(data.byteLength)
		process.stdout.write(sizeBuf)
		process.stdout.write(data)
	}

	onRequest(requestHandler: (requestReader: NanoBufReader) => void): void {
		this.requestHandler = requestHandler
	}

	open(): Promise<void> {
		this.isClosed = false
		return this.readStdin()
	}

	close() {
		this.isClosed = false
	}

	private async readStdin() {
		const msgSizeData = Buffer.allocUnsafe(4)
		while (!this.isClosed) {
			fs.readSync(process.stdin.fd, msgSizeData, 0, 4, null)

			const msgSize = msgSizeData.readUint32LE()
			const msgData: Buffer | null = process.stdin.read(msgSize)
			if (!msgData) continue

			const reader = new NanoBufReader(msgData)
			const msgType = reader.readUint8(0)
			switch (msgType) {
				case RpcMessageType.REQUEST:
					this.requestHandler?.(reader)
					break
				case RpcMessageType.RESPONSE:
					this.responseHandler?.(reader)
					break
				default:
					break
			}
		}
	}
}

export { NodeStandardIoRpcChannel }
