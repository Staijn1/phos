#include "definitions.h"

/**
    Include webserver/ websockets
*/
#include <WiFi.h>
#include <WebServer.h>
#include <WebSockets.h>           //https://github.com/Links2004/arduinoWebSockets
#include <WebSocketsServer.h>

/**
   Include Arduino JSON
*/
#include <ArduinoJson.h>


void setup() {
  Serial.begin(115200);
  pinMode(BUILTIN_LED, OUTPUT);
  setupWebserver();
  setupWebsocketServer();
  setupLedstrip();
}

void loop() {
  runWebsocketServer();
  runWebserver();
  runLedstrip();
}
