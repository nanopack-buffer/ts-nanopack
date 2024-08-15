import type { NanoBufReader } from "../reader.js"
import type { RpcClientChannel } from "./rpc-channel.js"

/**
 * RpcClient is responsible for sending request data, as well as managing pending requests.
 * Create or subclass RpcClient to send serialized RPC requests and receive responses for them.
 *
 * You usually don't have to use this class manually.
 * Instead, you author NanoPack RPC schemas, then you feed the schemas into nanoc.
 * nanoc will then generate the glue code for setting up RPC according to your schema.
 * The generated RPC client will subclass this,
 * and you can make RPC calls by calling the RPC functions defined as methods in the generated RPC client class.
 */
class RpcClient {
	private pendingRequests = new Map<
		number,
		(responseReader: NanoBufReader) => void
	>()

	/**
	 * Creates an instance of RpcClient that sends requests to and receives responses
	 * from a remote rpc server over the given {@link RpcClientChannel}.
	 *
	 * @param channel The channel over which this client communicates with the remote rpc server.
	 */
	constructor(private channel: RpcClientChannel) {
		channel.onResponse(this.onResponseReceived.bind(this))
	}

	/**
	 * Sends the given serialized RPC request with the given RPC message ID. to the remote RPC server.
	 * The first 5 bytes of the returned response data contains RPC metadata which you can safely ignore.
	 *
	 * @param msgId The ID of the request message. You can obtain a new one using {@link RpcClient.newMessageId}.
	 * @param data The serialized request message.
	 * @returns The serialized response for this request returned by the remote RPC server.
	 */
	public sendRequestData(
		msgId: number,
		data: Uint8Array,
	): Promise<NanoBufReader> {
		return new Promise<NanoBufReader>((resolve) => {
			this.pendingRequests.set(msgId, resolve)
			this.channel.sendRequestData(data)
		})
	}

	/**
	 * Returns a new RPC message ID.
	 */
	public newMessageId(): number {
		let id: number
		do {
			id = Math.floor(Math.random() * 4294967296)
		} while (this.pendingRequests.has(id))
		return id
	}

	private onResponseReceived(responseReader: NanoBufReader) {
		const msgId = responseReader.readUint32(1)
		const handler = this.pendingRequests.get(msgId)
		if (handler) {
			this.pendingRequests.delete(msgId)
			handler(responseReader)
		}
	}
}

export { RpcClient }
