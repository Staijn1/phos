
/**
   Include effects library
*/
#include <WS2812FX.h>
WS2812FX* strip;

void runLedstrip(){
  strip->service();  
}

void setupLedstrip() {
  strip = new WS2812FX(NUMLEDS, LED_PIN, NEO_GRB + NEO_KHZ400);
  strip->init();
  strip->start();

  strip->setMode(FX_MODE_STATIC);
  strip->setColor(0x000000);
}
