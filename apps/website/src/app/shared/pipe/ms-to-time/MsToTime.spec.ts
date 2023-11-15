import { MsToTimePipe } from "./MsToTime";

describe('MsToTimePipe', () => {
  let pipe: MsToTimePipe;

  beforeEach(() => {
    pipe = new MsToTimePipe();
  });

  it('should return 00:00 when duration is 0', () => {
    const duration = 0;
    expect(pipe.transform(duration)).toBe('00:00');
  });

  it('should return 00:00 when duration is less than 1 second', () => {
    const duration = 999;
    expect(pipe.transform(duration)).toBe('00:00');
  });

  it('should return 00:01 when duration is 1 second', () => {
    const duration = 1000;
    expect(pipe.transform(duration)).toBe('00:01');
  });

  it('should return 01:01 when duration is 1 minute 1 second', () => {
    const duration = 61000;
    expect(pipe.transform(duration)).toBe('01:01');
  });

  it('should return 01:01:01 when duration is 1 hour, 1 minute and 1 second', () => {
    const duration = 3661000;
    expect(pipe.transform(duration)).toBe('01:01:01');
  });

  it('should return 48:39:43 when duration matches the longest spotify song (48h 39m 43s)', () => {
    const duration = 175183000;
    expect(pipe.transform(duration)).toBe('48:39:43');
  });
});
