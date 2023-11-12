import { YesNoPipe } from './yes-no.pipe';

describe('YesNoPipe', () => {
  it('create an instance', () => {
    const pipe = new YesNoPipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert true to yes', () => {
    const pipe = new YesNoPipe();
    expect(pipe.transform(true)).toBe('Yes');
  });

  it('should convert false to no', () => {
    const pipe = new YesNoPipe();
    expect(pipe.transform(false)).toBe('No');
  });
});
