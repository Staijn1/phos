import { WebsocketClient } from '../Client/WebsocketClient'
import { KeyFunction } from '../Types/KeyFunction'
import { ledstripAdresses } from '../Config/Config'
import { logger } from '../Config/Logger'
import { prettyPrint } from '../Utils/functions'

/**
 * Handle incoming messages
 */
export class CommandHandler {
  ledstripAdresses: string[] = ledstripAdresses
  ledstrips: WebsocketClient[] = []
  private readonly commands: KeyFunction

  /**
   * Construct the object and fill commands list
   */
  constructor() {
    if (commandHandler) {
      throw Error('Commandhandler is a singleton class!')
    }
    this.commands = {
      m: this.changeMode.bind(this),
      s: this.decreaseSpeed.bind(this),
      S: this.increaseSpeed.bind(this),
      B: this.increaseBrightness.bind(this),
      b: this.decreaseBrightness.bind(this),
      v: this.setFFTValue.bind(this),
      c: this.setColor.bind(this),
    }

    this.connectToLedstrips()
  }

  /**
   * This function will process all incoming messages
   * @param {IMessage} payload
   */
  handleMessage(payload: any): void {
    // message is of type IMessage, the type chrashes the dockerfile
    const received = payload.utf8Data.split(' ')
    if (received[0] !== 'v') {
      logger.info(`Received command: ${received[0]} payload: ${received[1]}`)
    }
    try {
      this.commands[received[0]](received[1])
    } catch (e) {
      logger.error(`Caught error: ${prettyPrint(e)}`)
    }
  }

  /**
   * Connect to available ledstrips on the network
   * @private
   */
  private connectToLedstrips(): void {
    for (const ledstripAdress of this.ledstripAdresses) {
      this.ledstrips.push(new WebsocketClient(ledstripAdress))
    }
  }

  /**
   * Set the FFTValue on the ledstrips
   * @param {string}payload
   */
  setFFTValue(payload: string): void {
    this.sendAllLedstrips(`. ${payload}`)
  }

  /**
   * Decrease the brightness of the ledstrips
   */
  decreaseBrightness(): void {
    this.sendAllLedstrips('b')
  }

  /**
   * Increase the brightness of the ledstrips
   */
  increaseBrightness(): void {
    this.sendAllLedstrips('B')
  }

  /**
   * Increase the speed of the ledstrips
   */
  increaseSpeed(): void {
    this.sendAllLedstrips('S')
  }

  /**
   * Decrease the speed of the ledstrips
   */
  decreaseSpeed(): void {
    this.sendAllLedstrips('s')
  }

  /**
   * Change the modePage of the ledstrips
   * @param {string|number} payload
   */
  changeMode(payload: string | number): void {
    this.sendAllLedstrips(`/${payload}`)
  }

  /**
   * Set the color. Payload must be a string array containing hex values
   * @param {string[]}payload
   */
  setColor(payload: string): void {
    if (!payload.startsWith('#')) payload = '#' + payload
    logger.info(`Setting colors: ${payload}`)
    this.sendAllLedstrips(`${payload}`)
  }

  /**
   * Send a command to all ledstrips
   * @param {string} payload
   * @private
   */
  private sendAllLedstrips(payload: string): void {
    for (const ledstrip of this.ledstrips) {
      ledstrip.send(payload)
    }
  }
}

export const commandHandler = new CommandHandler()
