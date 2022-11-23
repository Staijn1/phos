import {Injectable} from '@angular/core'
import {Message} from '../../messages/Message';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _errors: Message[] = [];

  public setError(error: Error) {
    const mappedError = this.mapError(error)
    this._errors.push(mappedError)
    setTimeout(() => {
      this._errors.shift()
    }, 5000)
  }

  public getErrors(): Message[] {
    return this._errors
  }

  /**
   * Map an incoming error to a message object. If the incoming error is already a message, it will be returned as is.
   * @param {Error | Message} message
   * @returns {Message}
   * @private
   */
  private mapError(message: Error | Message): Message {
    if (message instanceof Message) {
      return message
    }
    return new Message('error', message.message)
  }
}
