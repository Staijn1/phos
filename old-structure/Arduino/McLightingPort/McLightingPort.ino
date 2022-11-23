#include "A20_definitions.h"

/**
   Conditional imports
*/
#ifdef INCLUDE_CUSTOM_EFFECTS
#include "A10_custom_effects.h"
#endif

/**
    Include webserver/ websockets
*/
#include <WiFi.h>
#include <WebServer.h>
#include <WebSockets.h>           //https://github.com/Links2004/arduinoWebSockets
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include <EEPROM.h>
#include<Preferences.h> //https://github.com/espressif/arduino-esp32/tree/master/libraries/Preferences
/**
   Include Arduino JSON
*/
#include <ArduinoJson.h>
extern const char index_html[];

Preferences preferences;
/**
    Initialized in configMode tab in setup
*/
bool isConfigured;
int ledCount;

void setup() {
  Serial.begin(115200);
  pinMode(BUILTIN_LED, OUTPUT);
  initializeConfigMode();

  if (isConfigured) {
    connectToWifi();
    setupLedstrip();
    setupWebsocketClient();
  }
  setupWebserver();
}

void loop() {
  runWebserver();

  if (isConfigured) {
    runWebsocketClient();
    runLedstrip();
  }
}
