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
  private readonly SHORT_TIMEOUT = 15000
  private readonly LONG_TIMEOUT = 60000

  /**
   * Construct the websocket
   * @param {string}url Url to connect to
   */
  constructor(url: string) {
    if (!url.startsWith('ws://')) throw Error('Url should start with ws://')
    this.url = url
    this.connect(false)
  }

  /**
   * Connect to a websocket
   * @param {boolean} isRetry If this is a retry attempt, set this to true
   * @private
   */
  private connect(isRetry: boolean): void {
    if (this.retryattempt >= 5 && !isRetry) {
      logger.warn(
        `Retry attempt too high for ${this.url}. Retry attempt no: ${this.retryattempt}. Retrying again on longer intervals`
      )
      setTimeout(() => this.connect(true), this.LONG_TIMEOUT)
      return
    }

    logger.info(`Connecting to ${this.url}`)
    this.client = new W3CWebSocket(this.url)
    this.client.onerror = this.handleError.bind(this)
    this.client.onopen = this.onopen.bind(this)
    this.client.onclose = this.onclose.bind(this)
    this.client.onmessage = this.handleMessage.bind(this)
    this.retryattempt++
  }

  /**
   * Send the payload to the server
   * @param {string}payload
   */
  send(payload: string) {
    if (this.client.readyState !== this.client.OPEN) {
      this.connect(false)
      return
    }
    this.client.send(payload)
  }

  /**
   * Fired when a message is received
   * @param {IMessageEvent}message The received message
   * @private
   */
  private handleMessage(message: IMessageEvent) {
    console.log(`"Received: ${message.data}`)
  }

  /**
   * Fired when the connection is closed
   * @private
   */
  private onclose(close: ICloseEvent) {
    logger.info(`Closed websocket connection: ${prettyPrint(close)}`)
    setTimeout(() => {
      this.connect(false)
    }, this.SHORT_TIMEOUT)
  }

  /**
   * Fired when connection is opened
   * @private
   */
  private onopen() {
    logger.info(`Openened websocket ${this.url}`)
    this.retryattempt = 0
  }

  /**
   * Fired when an error occured
   * @private
   */
  private handleError(e: Error) {
    logger.error(`Error occured: ${prettyPrint(e)}`)
  }
}
