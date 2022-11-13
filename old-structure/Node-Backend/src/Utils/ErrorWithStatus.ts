/**
 * Error to throw with HTTP error code
 */
export class ErrorWithStatus extends Error {
  code: number

  /**
   *
   * @param {string}message - Message of the error
   * @param {number} code - Http code associated with the error to send back
   */
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}
