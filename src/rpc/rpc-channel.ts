import type { NanoBufReader } from "../reader.js"

interface RpcClientChannel {
	sendRequestData(data: Uint8Array): void

	onResponse(responseHandler: (responseReader: NanoBufReader) => void): void
}

interface RpcServerChannel {
	sendResponseData(data: Uint8Array): void

	onRequest(requestHandler: (requestReader: NanoBufReader) => void): void
}

export type { RpcClientChannel, RpcServerChannel }
