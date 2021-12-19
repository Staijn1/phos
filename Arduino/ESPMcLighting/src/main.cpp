#include <Webserver.h>
#include <Arduino.h>

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);

  Serial.begin(9600);
  setupWebserver();
  setupLedstrip();
}

void loop() {
  runWebserver();
  runLedstrip();
}
