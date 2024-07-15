import { Injectable } from '@angular/core';
import { Message } from '../../shared/types/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _messages: Message[] = [];

  private readonly _clearMessageAfterMs = 5000;

  public setMessage(error: Error | Message) {
    const mappedError = this.mapError(error);
    this._messages.push(mappedError);
    setTimeout(() => {
      this._messages.shift();
    }, this._clearMessageAfterMs);
  }

  public getMessages(): Message[] {
    return this._messages;
  }

  /**
   * Map an incoming error to a message object. If the incoming error is already a message, it will be returned as is.
   * @param {Error | Message} message
   * @returns {Message}
   * @private
   */
  private mapError(message: Error | Message): Message {
    if (message instanceof Message) {
      return message;
    }
    return new Message('error', message.message);
  }
}
