#include <WS2812FX.h>


WS2812FX ws2812fx = WS2812FX(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setupLedstrip() {
  ws2812fx.init();
  setDefaultLedstripValues();


  //  ws2812fx.setCustomMode(F("VuMeter"), vuMeter);
  //  ws2812fx.setCustomMode(F("Fire2012"), fire2012Effect);
  //  ws2812fx.setCustomMode(F("Waterfall"), waterfallEffect);

  ws2812fx.start();
}

void setDefaultLedstripValues() {
  ws2812fx.setMode(FX_MODE_STATIC);
  uint32_t _colors[] = {0, 0, 0};
  ws2812fx.setColors(0, _colors);
  ws2812fx.setSpeed(1000);
  ws2812fx.setBrightness(185);
  ws2812fx.setOptions(0, REVERSE);
}

void runLedstrip() {
  ws2812fx.service();
}
