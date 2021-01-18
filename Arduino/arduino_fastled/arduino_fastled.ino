#include <FastLED.h>
#include "lilParser.h"
#include <ArduinoJson.h>
//#include "customEffects/TwinkleFox.h"

enum commands {   noCommand,  // ALWAYS start with noCommand.
                  setcolors,
                  setmode,
                  increasebrightness,
                  decreasebrightness,
                  setleds,
              };

lilParser   ourParser;        // The parser object.

void setup() {
  Serial.begin(19200);
  setupLedstrip();


  ourParser.addCmd(setcolors, "setColor");
  ourParser.addCmd(setmode, "setMode");
  ourParser.addCmd(increasebrightness, "increaseBrightness");
  ourParser.addCmd(decreasebrightness, "decreaseBrightness");
  ourParser.addCmd(setleds, "setLeds");
  reactiveEffect();
}

void loop(void) {
  char  inChar;
  int   command;

  if (Serial.available()) {                                 // If serial has some data...
    inChar = Serial.read();
    command = ourParser.addChar(inChar);
    switch (command) {
      case noCommand                : break;                               // Nothing to report, move along.
      case setcolors                : handleColors();             break;
      case setmode                  : handleMode();               break;
      case increasebrightness       : handleIncreaseBrightness(); break;
      case decreasebrightness       : handleDecreaseBrightness(); break;
      case setleds                  : handleSetLeds();            break;

      default                       : Serial.println("Unknown command");    break;    // No idea. Try again?
    }
  } else {
    runLedstrip();
  }


}
