#include <WS2812FX.h>

#ifndef NUM_BANDS
#define NUM_BANDS 1
#endif

extern WS2812FX* strip;
extern int ledCount;

int fftValue = 0;

uint16_t vuMeter(void) {
  WS2812FX::Segment *seg = strip->getSegment();
  const int amountOfLedsToShow = map(fftValue, 0, 255, 0, ledCount);

  for (int index = 0; index < ledCount; index++) {
    if (index <= amountOfLedsToShow) {
      strip->setPixelColor(index, seg->colors[0]);
    } else {
      strip->setPixelColor(index, seg->colors[1]);
    }
  }

  return seg->speed;
}

uint16_t vuMeterBrightness(void) {
  WS2812FX::Segment *seg = strip->getSegment();
  strip->setBrightness(fftValue);
  strip->fill(seg->colors[0], 0, ledCount - 1);


  return seg->speed;
}
