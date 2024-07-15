import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { Message } from '../../shared/types/Message';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should return no messages', () => {
    const result = service.getMessages();

    expect(result).toHaveLength(0);
  });

  it('should set a message', () => {
    const message = new Message('info', 'Some message');

    service.setMessage(message);

    const result = service.getMessages();

    expect(result).toContain(message);
  });


  it('should clear message after timeout', async () => {
    const message1 = new Message('info', 'Some message 1');

    // Set the message right now
    service.setMessage(message1);
    expect(service.getMessages()).toContain(message1);

    // After 2500ms check if the message is still there and continue our test
    await timeout(2500);
    expect(service.getMessages()).toContain(message1);

    await timeout(2500);
    expect(service.getMessages()).toHaveLength(0);
  }, 6000);
});


const timeout = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
};
