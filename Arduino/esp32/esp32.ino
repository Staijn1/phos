#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsServer.h>
// Git clone from Links2004 repo.
#include <WebSocketsServer.h>
#include <WS2812FX.h>
#include <ArduinoJson.h>
#include <mdns.h>
const size_t capacity = JSON_OBJECT_SIZE(1);

#define BUILTIN_LED 2
static const char ssid[] = "De gelaarsde kat";
static const char password[] = "JonkerDraadl00s";
void setup()
{
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  setupLed();
  initLeds();
  websocketSetup();
  MDNSSetup();
  
  for (int i = 0; i < 15; i++) {
    blinkLed(250);
  }
}

void loop()
{
  websocketRun();
  ledstripRun();
}
