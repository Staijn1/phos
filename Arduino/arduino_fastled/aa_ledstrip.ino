#define NUM_LEDS 30
#define DATA_PIN 7
int fftValue = 0;
int currentMode = 0;

const size_t capacity = JSON_OBJECT_SIZE(1);
CRGB leds[NUM_LEDS];

CRGB color;

void setupLedstrip() {
  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
}

void handleColors() {
  if (ourParser.numParams()) {                    // If they typed in somethng past the command.
    const char* charBuff = ourParser.getParamBuff();

    //    char * strtokIndx; // this is used by strtok() as an index
    //
    //    strtokIndx = strtok(charBuff, ",");     // get the first color
    //    uint32_t firstColor = (uint32_t)strtoul(strtokIndx, NULL, 16);
    //
    //    strtokIndx = strtok(NULL, ","); // this continues where the previous call left off, to get second color
    //    uint32_t secondColor = (uint32_t)strtoul(strtokIndx, NULL, 16);
    //
    //    strtokIndx = strtok(NULL, ","); //Repeat to get third color
    //    uint32_t thirdColor = (uint32_t)strtoul(strtokIndx, NULL, 16);
    //
    //    colorPalette[0] = firstColor;
    //    colorPalette[1] = secondColor;
    //    colorPalette[2] = thirdColor;

    DynamicJsonDocument doc(30);
    deserializeJson(doc, charBuff);

    int r = doc["r"];
    int g = doc["g"];
    int b = doc["b"];
    color = CRGB(r, g, b);
    free(charBuff);
  }

}

void handleIncreaseBrightness() {
  FastLED.setBrightness(constrain(FastLED.getBrightness() * 1.1, 0, 255));
}

void handleDecreaseBrightness() {
  FastLED.setBrightness(FastLED.getBrightness() * 0.9);
}

void handleSetLeds() {
  if (ourParser.numParams()) {
    const char* charBuff = ourParser.getParamBuff();
    fftValue = constrain((uint8_t)atoi(charBuff), 0, 255);
    free(charBuff);
  }
}

void handleMode() {
  Serial.println(currentMode);
  if (ourParser.numParams()) {                    // If they typed in somethng past the command.
    const char* charBuff = ourParser.getParamBuff();
    currentMode = (int)atoi(charBuff);

    free(charBuff);
  }
}

void runLedstrip() {

  switch (currentMode) {
    case 0: staticMode(); break;
    case 11: rainbowEffect(); break;
    case 55: vuMeter(); break;
    case 56: reactiveEffect(); break;

    default: break;//Do nothing
  }
}
