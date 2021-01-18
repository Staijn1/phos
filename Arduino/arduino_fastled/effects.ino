int hue = 0;
void staticMode() {
  fill_solid(leds, NUM_LEDS, color);
  FastLED.show();
}

void rainbowEffect() {
  EVERY_N_MILLISECONDS(0) {
    hue++;
    hue = hue % 255;
  
    fill_rainbow(leds, NUM_LEDS, hue);
    FastLED.show();
  }
}

void vuMeter() {
  const int amountOfLedsToShow = map(fftValue, 0, 255, 0, NUM_LEDS);
  for (int index = 0; index < NUM_LEDS; index++) {
    if (index <= amountOfLedsToShow) {
      leds[index] = color;
    } else {
      leds[index] = CRGB::Black;
    }
  }
  FastLED.show();
}

void reactiveEffect() {

  //  for(int i = 0; i < NUM_LEDS; i++){
  //    ws2812fx.setPixelColor(i, ws2812fx.ColorHSV(map(fftValue, 0, 255, 0, 65535), 255, 255));
  //  }
}
