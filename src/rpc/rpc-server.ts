import type { NanoBufReader } from "../reader.js"
import { NanoBufWriter } from "../writer.js"
import { RpcMessageType } from "./message-type.js"
import type { RpcServerChannel } from "./rpc-channel.js"

/**
 * The signature of a callback that handles an RPC call and returns a serialized response to it.
 *
 * @param requestReader The reader that can be used to read the RPC call info, including parameters.
 * @param offset The offset in requestReader where serialized arguments to the call starts.
 * @param msgId The ID of the RPC request message.
 * @returns serialized response to the RPC call, or null if failed to deserialize the request.
 */
type RpcCallHandler = (
	requestReader: NanoBufReader,
	offset: number,
	msgId: number,
) => NanoBufWriter | null

/**
 * RpcServer is responsible for registering RPC call handlers, as well as incoming RPC requests.
 * The appropriate call handlers will be called depending on the method specified by the incoming RPC request.
 *
 * You usually don't have to use this class manually.
 * Instead, you author NanoPack RPC schemas, then you feed the schemas into nanoc.
 * nanoc will then generate the glue code for setting up RPC according to your schema.
 * The generated RPC server class will subclass this.
 * Its constructor will ask for an implementation of the RPC service defined in the schema.
 * You can define the implementation in a separate file,
 * and pass the implementation to the generated class when creating it.
 */
class RpcServer {
	private callHandlers = new Map<string, RpcCallHandler>()

	/**
	 * Creates an instance of RpcServer that listens for incoming requests over the provided channel.
	 * It will also send responses over the channel.
	 *
	 * @param channel The channel over which this server will listen for requests and send replies.
	 */
	constructor(private channel: RpcServerChannel) {
		channel.onRequest(this.onRequestData.bind(this))
	}

	/**
	 * Registers the given callback to be called whenever the given method name matches
	 * the method name contained in an RPC Request.
	 *
	 * @param method The name of the RPC method to handle.
	 * @param callHandler The callback to be called when the named RPC method is called.
	 */
	on(method: string, callHandler: RpcCallHandler) {
		this.callHandlers.set(method, callHandler)
	}

	private onRequestData(requestReader: NanoBufReader) {
		const msgId = requestReader.readUint32(1)
		const methodNameLen = requestReader.readUint32(5)
		const methodName = requestReader.readString(9, methodNameLen)
		const handler = this.callHandlers.get(methodName)
		if (!handler) {
			return
		}
		const responseData = handler(requestReader, 9 + methodNameLen, msgId)
		if (responseData) {
			this.channel.sendResponseData(responseData.bytes)
		} else {
			const writer = new NanoBufWriter(6, false)
			writer.appendUint8(RpcMessageType.RESPONSE)
			writer.appendUint32(msgId)
			writer.appendUint8(1)
			this.channel.sendResponseData(writer.bytes)
		}
	}
}

export { RpcServer }
export type { RpcCallHandler }
