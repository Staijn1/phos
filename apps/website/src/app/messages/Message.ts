/**
 * A class to transport custom messages through the application, which will be shown to the user.
 */
export class Message extends Error {
  constructor(
    public severity: 'error' | 'warning' | 'info' | 'success',
    message: string,
    public action?: () => void
  ) {
    super(message);
  }
}
