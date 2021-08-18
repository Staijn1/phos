import {
  ICloseEvent,
  IMessageEvent,
  w3cwebsocket as W3CWebSocket,
} from 'websocket'
import { logger } from '../Config/Logger'
import { prettyPrint } from '../Utils/functions'

/**
 * Class to connect to other websockets (on the ESP32 modules)
 */
export class WebsocketClient {
  client: W3CWebSocket
  url: string
  retryattempt = 0
  private readonly SHORT_TIMEOUT = 25000
  private readonly LONG_TIMEOUT = 75000
  private interval: NodeJS.Timeout

  /**
   * Construct the websocket
   * @param {string}url Url to connect to
   */
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
    logger.info(`Connecting to ${this.url}`)
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
      logger.info(`[${this.url}] Reconnecting immediately`)
      this.connect()
    } else if (this.retryattempt < 5) {
      logger.info(
        `[${this.url}] Reconnecting on short intervals (${this.SHORT_TIMEOUT})`
      )
      this.interval = setInterval(() => this.connect(), this.SHORT_TIMEOUT)
    } else {
      logger.info(
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
    console.log(`[${this.url}] Received: ${message.data}`)
  }

  /**
   * Fired when the connection is closed
   * @param {ICloseEvent} close
   * @private
   */
  private onclose(close: ICloseEvent) {
    logger.info(
      `[${this.url}] Closed websocket connection: ${prettyPrint(close)}`
    )
    this.reconnect()
  }

  /**
   * Fired when connection is opened
   * @private
   */
  private onopen() {
    logger.info(`[${this.url}] Openened websocket`)
    this.retryattempt = 0
    clearInterval(this.interval)
  }

  /**
   * Fired when an error occured
   * @param {Error} e
   * @private
   */
  private handleError(e: Error) {
    logger.error(`[${this.url}] Error occured: ${prettyPrint(e)}`)
    throw e
  }
}
