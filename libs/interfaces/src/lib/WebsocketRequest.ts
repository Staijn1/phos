/**
 * Type for a websocket request message.
 * Allows for additional metadata to be sent with the request.
 */
export interface WebsocketRequest<T> {
  /**
   * A list of room ID's.
   * Each device in that are in one of these rooms will receive the message.
   */
  rooms: string[];

  /**
   * The payload of the message.
   * Is of type Generic
   */
  payload: T;
}
