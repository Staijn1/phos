// Program.cs — .NET 8 console. Minimal DDP sender for WLED (≤200 LEDs, 1 packet/frame).
// Enable DDP in WLED (Sync Interfaces). Default UDP port: 4048.
using System;
using System.Diagnostics;
using System.Net.Sockets;

class Program
{
    // CONFIG
    const string WLED_IP = "10.10.10.3"; // <-- set your WLED IP
    const int    WLED_PORT = 4048;
    const int    LED_COUNT = 60;           // physical LEDs
    const int    FPS = 60;                 // 30–60 is typical
    const int    BPP = 3;                  // 3=RGB, 4=RGBW
    const double BRIGHT = 1;             // 0..1

    static volatile bool _cancel;

    static void Main()
    {
        Console.CancelKeyPress += (s, e) => { _cancel = true; e.Cancel = true; };

        using var udp = new UdpClient();
        udp.Connect(WLED_IP, WLED_PORT);

        var payload = new byte[LED_COUNT * BPP];
        byte seq = 0;

        var sw = Stopwatch.StartNew();
        long periodTicks = (long)(Stopwatch.Frequency / (double)FPS);
        long nextDeadline = sw.ElapsedTicks;

        while (!_cancel)
        {
            // Pace to next frame
            long now = sw.ElapsedTicks;
            if (now < nextDeadline)
                SleepTicks(nextDeadline - now);
            now = sw.ElapsedTicks;

            // Late-drop: if we missed 75% of the frame budget, skip sending this frame
            long lateness = now - nextDeadline;
            nextDeadline += periodTicks;
            if (lateness > (long)(0.75 * periodTicks))
                continue;

            // Build one frame (simple rainbow wheel moving over time)
            double t = sw.Elapsed.TotalSeconds * 0.50;
            FillRainbow(payload, t);

            // Send one DDP packet starting at pixel 0
            SendDdp(udp, seq++, payload);
        }
    }

    static void SendDdp(UdpClient udp, byte seq, byte[] rgb)
    {
        // DDP v1 10-byte header (network order):
        // flags(1) | seq(1) | data_type(1) | dest_id(1) | offset(4) | data_len(2)
        // flags: 0x40 = VER1, 0x01 = PUSH
        const byte FLAGS = 0x41;   // VER1 + PUSH
        const byte TYPE_RGB = 0x01;
        const byte DEST_ID = 0x01; // arbitrary
        const int  OFFSET = 0;

        if (rgb.Length > 1440)
            throw new ArgumentException("Payload >1440 bytes (would risk IP fragmentation).");

        var header = new byte[10];
        header[0] = FLAGS;
        header[1] = seq;
        header[2] = TYPE_RGB;
        header[3] = DEST_ID;
        // offset (uint32 BE)
        header[4] = (byte)((OFFSET >> 24) & 0xFF);
        header[5] = (byte)((OFFSET >> 16) & 0xFF);
        header[6] = (byte)((OFFSET >> 8) & 0xFF);
        header[7] = (byte)(OFFSET & 0xFF);
        // data_len (uint16 BE)
        header[8] = (byte)((rgb.Length >> 8) & 0xFF);
        header[9] = (byte)(rgb.Length & 0xFF);

        var packet = new byte[header.Length + rgb.Length];
        Buffer.BlockCopy(header, 0, packet, 0, header.Length);
        Buffer.BlockCopy(rgb, 0, packet, header.Length, rgb.Length);

        udp.Send(packet, packet.Length);
    }

    static void FillRainbow(byte[] buf, double t)
    {
        for (int i = 0; i < LED_COUNT; i++)
        {
            double h = (i / (double)LED_COUNT + t) % 1.0; // 0..1
            HsvToRgb(h, 1.0, BRIGHT, out byte r, out byte g, out byte b);

            int o = i * BPP;
            buf[o + 0] = r;
            buf[o + 1] = g;
            buf[o + 2] = b;
            if (BPP == 4) buf[o + 3] = 0; // no white channel use
        }
    }

    // HSV (0..1) → RGB bytes
    static void HsvToRgb(double h, double s, double v, out byte r, out byte g, out byte b)
    {
        if (s <= 0.0) { r = g = b = (byte)(v * 255.0); return; }
        h = (h % 1.0 + 1.0) % 1.0;
        double hh = h * 6.0;
        int i = (int)Math.Floor(hh);
        double f = hh - i;
        double p = v * (1.0 - s);
        double q = v * (1.0 - s * f);
        double t = v * (1.0 - s * (1.0 - f));
        double rd=0, gd=0, bd=0;

        switch (i % 6)
        {
            case 0: rd = v; gd = t; bd = p; break;
            case 1: rd = q; gd = v; bd = p; break;
            case 2: rd = p; gd = v; bd = t; break;
            case 3: rd = p; gd = q; bd = v; break;
            case 4: rd = t; gd = p; bd = v; break;
            case 5: rd = v; gd = p; bd = q; break;
        }
        r = (byte)(rd * 255.0);
        g = (byte)(gd * 255.0);
        b = (byte)(bd * 255.0);
    }

    static void SleepTicks(long ticks)
    {
        // Coarse sleep then spin-wait for precision
        double ms = ticks * 1000.0 / Stopwatch.Frequency;
        if (ms > 2.0) System.Threading.Thread.Sleep((int)(ms - 1.0));
        while (ticks > 0)
            ticks = (long)(ticks - (Stopwatch.GetTimestamp() - 0));
    }
}
