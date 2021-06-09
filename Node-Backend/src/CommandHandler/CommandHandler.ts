import { WebsocketClient } from '../Client/WebsocketClient'
import { KeyFunction } from '../Types/KeyFunction'
import { IMessage } from 'websocket'
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
  handleMessage(payload: IMessage): void {
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
  setFFTValue(payload: string) {
    this.sendAllLedstrips(`v ${payload}`)
  }

  /**
   * Decrease the brightness of the ledstrips
   */
  decreaseBrightness() {
    this.sendAllLedstrips('b')
  }

  /**
   * Increase the brightness of the ledstrips
   */
  increaseBrightness() {
    this.sendAllLedstrips('B')
  }

  /**
   * Increase the speed of the ledstrips
   */
  increaseSpeed() {
    this.sendAllLedstrips('S')
  }

  /**
   * Decrease the speed of the ledstrips
   */
  decreaseSpeed() {
    this.sendAllLedstrips('s')
  }

  /**
   * Change the modePage of the ledstrips
   * @param {string|number} payload
   */
  changeMode(payload: string | number) {
    this.sendAllLedstrips(`m ${payload}`)
  }

  /**
   * Set the color. Payload must be a string array containing hex values
   * @param {string[]}payload
   */
  setColor(payload: string[]) {
    const formattedColors: string[] = []
    for (const color of payload) {
      formattedColors.push(color.replace('#', '').trim())
    }
    logger.info(formattedColors.join(','))
    this.sendAllLedstrips(`c ${formattedColors.join(',')}`)
  }

  /**
   * Send a command to all ledstrips
   * @param {string} payload
   * @private
   */
  private sendAllLedstrips(payload: string) {
    for (const ledstrip of this.ledstrips) {
      ledstrip.send(payload)
    }
  }
}

export const commandHandler = new CommandHandler()
