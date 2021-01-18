#include <WS2812FX.h>
#include "FastLED.h"
#include "lilParser.h"
#include <ArduinoJson.h>
#include "customEffects/TwinkleFox.h"

#define LED_COUNT 30
#define LED_PIN 7

int visualizerLeds = 0;
#include "customEffects/VUMeter.h"
enum commands {   noCommand,  // ALWAYS start with noCommand. Or something simlar.
                  setcolors,
                  setmode,
                  _pause,
                  _resume,
                  _run,
                  _stop,
                  increasebrightness,
                  decreasebrightness,
                  increasespeed,
                  decreasespeed,
                  //                  setsegment,
                  setleds,
                  //                  setspeed,
              };          // Our list of commands.

lilParser   ourParser;        // The parser object.

WS2812FX ws2812fx = WS2812FX(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

const size_t capacity = JSON_OBJECT_SIZE(1);
void setup() {

  Serial.begin(19200);
  ws2812fx.init();
  ws2812fx.setBrightness(200);
  ws2812fx.setSpeed(1000);
  uint32_t _colors[] = {0, 0, 0};
  ws2812fx.setColors(0, _colors);
  ws2812fx.setMode(FX_MODE_STATIC);
  ws2812fx.start();

  ws2812fx.setCustomMode(F("VuMeter"), vuMeter);
  ws2812fx.setCustomMode(F("Twinkle Fox"), twinkleFox);
  ws2812fx.setCustomMode(F("Fire2012"), fire2012Effect);
  ws2812fx.setCustomMode(F("Waterfall"), waterfallEffect);
  ourParser.addCmd(setcolors, "setColor");
  ourParser.addCmd(setmode, "setMode");
  ourParser.addCmd(_pause, "pause");
  ourParser.addCmd(_resume, "resume");
  ourParser.addCmd(_run, "run");
  ourParser.addCmd(_stop, "stop");
  ourParser.addCmd(increasebrightness, "increaseBrightness");
  ourParser.addCmd(decreasebrightness, "decreaseBrightness");
  ourParser.addCmd(increasespeed, "increaseSpeed");
  ourParser.addCmd(decreasespeed, "decreaseSpeed");
  //  ourParser.addCmd(setsegment, "setSegment");
  ourParser.addCmd(setleds, "setLeds");
}

void loop(void) {
  ws2812fx.service();
  char  inChar;
  int   command;

  if (Serial.available()) {                                 // If serial has some data...
    inChar = Serial.read();
    command = ourParser.addChar(inChar);
    switch (command) {
      case noCommand                : break;                               // Nothing to report, move along.
      case setcolors                : handleColors();             break;
      case setmode                  : handleMode();               break;
      case _pause                   : handlePause();              break;
      case _resume                  : handleResume();             break;
      case _run                     : handleRun();                break;
      case _stop                    : handleStop();               break;
      case increasebrightness       : handleIncreaseBrightness(); break;
      case decreasebrightness       : handleDecreaseBrightness(); break;
      case increasespeed            : handleIncreaseSpeed();      break;
      case decreasespeed            : handleDecreaseSpeed();      break;
      //      case setsegment               : handleSetSegment();         break;
      case setleds                  : handleSetLeds();            break;

      default                       : Serial.println("Unknown command");    break;    // No idea. Try again?
    }
  }
}

void handleColors() {
  if (ourParser.numParams()) {                    // If they typed in somethng past the command.
    char* charBuff = ourParser.getParamBuff();
    char * strtokIndx; // this is used by strtok() as an index

    strtokIndx = strtok(charBuff, ",");     // get the first color
    uint32_t firstColor = (uint32_t)strtoul(strtokIndx, NULL, 16);

    strtokIndx = strtok(NULL, ","); // this continues where the previous call left off, to get second color
    uint32_t secondColor = (uint32_t)strtoul(strtokIndx, NULL, 16);

    strtokIndx = strtok(NULL, ","); //Repeat to get third color
    uint32_t thirdColor = (uint32_t)strtoul(strtokIndx, NULL, 16);

    uint32_t _colors[] = {firstColor, secondColor, thirdColor};
    ws2812fx.setColors(0, _colors);
    free(charBuff);
  }
}

void handlePause() {
  ws2812fx.pause();
}

void handleResume() {
  ws2812fx.resume();
}

void handleRun() {
  ws2812fx.start();
}

void handleStop() {
  ws2812fx.stop();
}

void handleIncreaseBrightness() {
  ws2812fx.increaseBrightness(25);
}

void handleDecreaseBrightness() {
  ws2812fx.decreaseBrightness(25);
}

void handleIncreaseSpeed() {
  ws2812fx.setSpeed(ws2812fx.getSpeed() * 0.6);
  StaticJsonDocument<capacity>doc;
  doc["speed"] = ws2812fx.getSpeed();
  serializeJson(doc, Serial);
}

void handleDecreaseSpeed() {
  ws2812fx.setSpeed(ws2812fx.getSpeed() * 1.4);
  StaticJsonDocument<capacity>doc;
  doc["speed"] = ws2812fx.getSpeed();
  serializeJson(doc, Serial);
}

void handleSetSegment() {
  if (ourParser.numParams()) {
    char* charBuff = ourParser.getParamBuff();
    Serial.println(charBuff);                                             // Cuts it off
    free(charBuff);
  }
}

void handleSetLeds() {
  if (ourParser.numParams()) {
    char* charBuff = ourParser.getParamBuff();
    visualizerLeds = constrain((uint8_t)atoi(charBuff), 0, 255);
    free(charBuff);
  }
}


void handleMode() {
  if (ourParser.numParams()) {                    // If they typed in somethng past the command.
    char* charBuff = ourParser.getParamBuff();
    uint8_t m = (uint8_t)atoi(charBuff);
    free(ourParser.getParamBuff());
    if (m == 55) {
      ws2812fx.setSegment(0, 0, LED_COUNT - 1, vuMeter, ws2812fx.getColor(), 0, NO_OPTIONS);
    }
    ws2812fx.setMode(m);

    free(charBuff);
  }
}
