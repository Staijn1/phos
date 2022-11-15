import {Logger} from '@nestjs/common';
import {ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket,} from 'websocket'
import {prettyPrint} from "../../../../../old-structure/Node-Backend/src/Utils/functions";


export class WebsocketClient {
  private readonly SHORT_TIMEOUT = 25000
  private readonly LONG_TIMEOUT = 75000
  private readonly logger: Logger = new Logger(WebsocketClient.name)
  private readonly url: string
  private interval: NodeJS.Timeout
  private client: W3CWebSocket
  private retryattempt = 0

  constructor(url: string) {
    if (!url.startsWith('ws://')) throw Error('Url should start with ws://')
    this.url = url
    this.connect()
  }

  /**
   * Connect to a websocket
   * @private
   */
  private connect(): void {
    this.logger.log(`Connecting to ${this.url}`)
    this.client = new W3CWebSocket(this.url)
    this.client.onerror = this.handleError.bind(this)
    this.client.onopen = this.onopen.bind(this)
    this.client.onclose = this.onclose.bind(this)
    this.client.onmessage = this.handleMessage.bind(this)
    this.retryattempt++
  }

  /**
   * Reconnects a websocket
   * @private
   */
  private reconnect(): void {
    // Its our first time reconnecting, immediately try to reconnect
    if (this.retryattempt == 0) {
      this.logger.log(`[${this.url}] Reconnecting immediately`)
      this.connect()
    } else if (this.retryattempt < 5) {
      this.logger.log(
        `[${this.url}] Reconnecting on short intervals (${this.SHORT_TIMEOUT})`
      )
      this.interval = setInterval(() => this.connect(), this.SHORT_TIMEOUT)
    } else {
      this.logger.log(
        `[${this.url}] Retry attempt too high, retrying on longer intervals (${this.LONG_TIMEOUT})`
      )
      this.interval = setInterval(() => this.connect(), this.LONG_TIMEOUT)
    }
  }

  /**
   * Send the payload to the server
   * @param {string}payload
   */
  send(payload: string): void {
    if (this.client.readyState !== this.client.OPEN) {
      throw Error(`Websocket on ${this.url} is not connected`)
    }
    this.client.send(payload)
  }

  /**
   * Fired when a message is received
   * @param {IMessageEvent}message The received message
   * @private
   */
  private handleMessage(message: IMessageEvent) {
    this.logger.log(`[${this.url}] Received: ${message.data}`)
  }

  /**
   * Fired when the connection is closed
   * @param {ICloseEvent} close
   * @private
   */
  private onclose(close: ICloseEvent) {
    this.logger.log(
      `[${this.url}] Closed websocket connection: ${prettyPrint(close)}`
    )
    this.reconnect()
  }

  /**
   * Fired when connection is opened
   * @private
   */
  private onopen() {
    this.logger.log(`[${this.url}] Openened websocket`)
    this.retryattempt = 0
    clearInterval(this.interval)
  }

  /**
   * Fired when an error occured
   * @param {Error} e
   * @private
   */
  private handleError(e: Error) {
    this.logger.error(`[${this.url}] Error occured: ${prettyPrint(e)}`)
  }

  /**
   * Disconnect the websocket
   */
  disconnect() {
    this.client.close()
  }
}
