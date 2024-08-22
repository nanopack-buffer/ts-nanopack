import { NanoBufReader } from "../reader.js"
import { RpcMessageType } from "./message-type.js"
import type { RpcClientChannel, RpcServerChannel } from "./rpc-channel.js"

class NodeStandardIoRpcChannel implements RpcServerChannel, RpcClientChannel {
	private requestHandler: ((requestReader: NanoBufReader) => void) | null = null
	private responseHandler: ((responseReader: NanoBufReader) => void) | null =
		null

	private isSizeMessage = true

	constructor() {
		process.stdin.on("data", (buffer) => {
			this.onStdinData(buffer)
		})
	}

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

	private onStdinData(buffer: Buffer) {
		if (this.isSizeMessage) {
			this.isSizeMessage = false
		} else {
			const reader = new NanoBufReader(buffer)
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
			this.isSizeMessage = true
		}
	}
}

export { NodeStandardIoRpcChannel }
