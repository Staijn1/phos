#include <WS2812FX.h>
#include "lilParser.h"
#include <ArduinoJson.h>


#define LED_COUNT 30
#define LED_PIN 7

int visualizerLeds = 0;
#include "customEffects/VUMeter.h"
enum commands {   noCommand,  // ALWAYS start with noCommand. Or something simlar.
                  setcolor,
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
                  startjson,
                  //                  setspeed,
              };          // Our list of commands.

lilParser   ourParser;        // The parser object.

WS2812FX ws2812fx = WS2812FX(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

boolean jsonMode = false;
void setup() {

  Serial.begin(19200);
  ws2812fx.init();
  ws2812fx.setBrightness(200);
  ws2812fx.setSpeed(1000);
  ws2812fx.setColor(0x000000);
  ws2812fx.setMode(FX_MODE_STATIC);
  ws2812fx.start();

  ws2812fx.setCustomMode(F("VuMeter"), vuMeter);

  ourParser.addCmd(setcolor, "setColor");
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
  ourParser.addCmd(startjson, "startJSON");
}

void loop(void) {
  ws2812fx.service();
  char  inChar;
  int   command;

  if (Serial.available()) {                                 // If serial has some data...
    inChar = Serial.read();
    //    Serial.print(inChar);
    command = ourParser.addChar(inChar);
    switch (command) {
      case noCommand                : break;                               // Nothing to report, move along.
      case setcolor                 : handleColor();              break;
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
      case startjson                : handleStartJson();          break;
      default                       : Serial.println("What?");    break;    // No idea. Try again?
    }
  }
}

void handleColor() {
  if (ourParser.numParams()) {                    // If they typed in somethng past the command.
    char* charBuff = ourParser.getParamBuff();
    uint32_t c = (uint32_t)strtoul(charBuff, NULL, 16);         // We get the first parameter, assume its the new folder's name.
    ws2812fx.setColor(c);
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
  ws2812fx.setSpeed(ws2812fx.getSpeed() * 0.8);
}

void handleDecreaseSpeed() {
  ws2812fx.setSpeed(ws2812fx.getSpeed() * 1.2);
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
    visualizerLeds = (uint8_t)atoi(charBuff);
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

void handleStartJson() {
  jsonMode = true;
}
