#include "config.h"
#include <Arduino.h>
#include<FastLED.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <WS2812FX.h>
#include <WiFiMulti.h>
#include <WebSocketsServer.h>
// Git clone from Links2004 repo.
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <mdns.h>

#define BUILTIN_LED 2
#define DEFAULT_COLOR_LEDSTRIP 0x000000
#define DEFAULT_BRIGHTNESS_LEDSTRIP 180
#define DEFAULT_SPEED_LEDSTRIP 1000
#define DEFAULT_MODE_LEDSTRIP FX_MODE_STATIC

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

// it wil set the static IP address to 192, 168, 1, 184
IPAddress local_IP(192, 168, 178, 3);
//it wil set the gateway static IP address to 192, 168, 1,1
IPAddress gateway(192, 168, 178, 1);
IPAddress subnet(255, 255, 0, 0);
void setup()
{
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  setupLed();
  initLeds();
  websocketSetup();

  for (int i = 0; i < 15; i++) {
    // We are done, blink fast to notify
    blinkLed(250);
  }
}

void loop()
{
  websocketRun();
  ledstripRun();
}
