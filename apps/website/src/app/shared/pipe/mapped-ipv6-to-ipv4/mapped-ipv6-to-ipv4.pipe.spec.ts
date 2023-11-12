import { MappedIPv6ToIPv4Pipe } from './mapped-ipv6-to-ipv4.pipe';

describe('MappedIPv6ToIPv4Pipe', () => {
  it('create an instance', () => {
    const pipe = new MappedIPv6ToIPv4Pipe();
    expect(pipe).toBeTruthy();
  });

  it('should map an IPv4 IP address that was mapped to an IPv6 address back to IPv4', () => {
    const pipe = new MappedIPv6ToIPv4Pipe();

    expect("::ffff:127.0.0.1").toBe("127.0.0.1");
  });

  it("should not map an IPv6 IP address", () => {
    const pipe = new MappedIPv6ToIPv4Pipe();

    expect("2001:db8:3333:4444:5555:6666:7777:8888").toBe("2001:db8:3333:4444:5555:6666:7777:8888");
    expect("2001:db8::").toBe("2001:db8::");
    expect("::1234:5678").toBe("::1234:5678");
  });
});
