/**
   Include effects library
*/
#include <WS2812FX.h>

WS2812FX* strip;

void runLedstrip() {
  strip->service();
}

void setupLedstrip() {
  strip = new WS2812FX(ledCount, preferences.getInt("ledpin"), NEO_GRB + NEO_KHZ800);
  strip->init();
#ifdef INCLUDE_CUSTOM_EFFECTS
  Serial.println("[LEDSTRIP]: Registering VUMeter effect");
  strip->setCustomMode(F("VuMeter"), vuMeter);

  Serial.println("[LEDSTRIP]: Registering VUMeterBrightness effect");
  strip->setCustomMode(F("VuMeter Brightness"), vuMeterBrightness);
#endif


  strip->setMode(FX_MODE_STATIC);
  strip->setColor(0x000000);
  strip->start();
}
