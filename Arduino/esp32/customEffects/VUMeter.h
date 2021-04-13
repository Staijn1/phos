/*
  Custom effect that mimics a multiband VU meter

  Keith Lord - 2018

  LICENSE

  The MIT License (MIT)

  Copyright (c) 2018  Keith Lord

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sub-license, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

  CHANGELOG
  2018-08-21 initial version
*/

#ifndef VUMeter_h
#define VUMeter_h

#include <WS2812FX.h>

#ifndef NUM_BANDS
#define NUM_BANDS 1
#endif

extern WS2812FX ws2812fx;

uint16_t vuMeter(void) {
    WS2812FX::Segment *seg = ws2812fx.getSegment();
    const int amountOfLedsToShow = map(fftValue, 0, 255, 0, NUM_LEDS);

    for (int index = 0; index < NUM_LEDS; index++) {
        if (index <= amountOfLedsToShow) {
            ws2812fx.setPixelColor(index, seg->colors[0]);
        } else {
            ws2812fx.setPixelColor(index, seg->colors[1]);
        }
    }

    return seg->speed;
}

#endif
