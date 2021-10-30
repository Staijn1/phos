/**
   Include effects library
*/
#include <WS2812FX.h>

WS2812FX* strip;
void runLedstrip() {
  strip->service();
}

void setupLedstrip() {
  strip = new WS2812FX(NUMLEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
  strip->init();
#ifdef INCLUDE_VUMETER
  Serial.println("[LEDSTRIP]: Registering VUMeter effect");
  strip->setCustomMode(F("VuMeter"), vuMeter);
#endif


  strip->setMode(FX_MODE_STATIC);
  strip->setColor(0x000000);
  strip->start();
}
