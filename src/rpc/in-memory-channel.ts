import { NanoBufReader } from "../reader.js"
import type { RpcClientChannel, RpcServerChannel } from "./rpc-channel.js"

class InMemoryRpcChannel implements RpcClientChannel, RpcServerChannel {
	private requestHandler: ((requestReader: NanoBufReader) => void) | null = null
	private responseHandler: ((responseReader: NanoBufReader) => void) | null =
		null

	sendRequestData(data: Uint8Array): void {
		const buffer = Buffer.from(data)
		const reader = new NanoBufReader(buffer)
		this.requestHandler?.(reader)
	}

	onResponse(responseHandler: (responseReader: NanoBufReader) => void): void {
		this.responseHandler = responseHandler
	}

	sendResponseData(data: Uint8Array): void {
		const buffer = Buffer.from(data)
		const reader = new NanoBufReader(buffer)
		this.responseHandler?.(reader)
	}

	onRequest(requestHandler: (requestReader: NanoBufReader) => void): void {
		this.requestHandler = requestHandler
	}
}

export { InMemoryRpcChannel }
