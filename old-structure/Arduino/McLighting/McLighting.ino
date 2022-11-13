/*
   If compile fails and error is something like:
   error: 'const char HTTP_HEAD []' redeclared as different kind of symbol
   See @shootdaj's answer on issue: https://github.com/zhouhan0126/WIFIMANAGER-ESP32/issues/17
   @jotadepicas corrected the other answer with a typo.
*/
#include "definitions.h"
#include "version.h"
// ***************************************************************************
// Load libraries for: WebServer / WiFiManager / WebSockets
// ***************************************************************************
#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino

// needed for library WiFiManager
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>        //https://github.com/tzapu/WiFiManager

#include <WiFiClient.h>
#include <ESP8266mDNS.h>
#include <FS.h>
#include <EEPROM.h>

#include <WebSockets.h>           //https://github.com/Links2004/arduinoWebSockets
#include <WebSocketsServer.h>


//SPIFFS Save
#if defined(ENABLE_STATE_SAVE_SPIFFS)
#include <ArduinoJson.h>        //https://github.com/bblanchon/ArduinoJson
#endif

#ifdef ARDUINOJSON_VERSION
#if !(ARDUINOJSON_VERSION_MAJOR == 6 and ARDUINOJSON_VERSION_MINOR >= 8)
#error "Install ArduinoJson v6.8.0-beta or higher"
#endif
#endif

#ifdef USE_HTML_MIN_GZ
#include "html_gz.h"
#endif

// ***************************************************************************
// Instanciate HTTP(80) / WebSockets(81) Server
// ***************************************************************************
ESP8266WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);


// ***************************************************************************
// Load libraries / Instanciate WS2812FX library
// ***************************************************************************
// https://github.com/kitesurfer1404/WS2812FX
#include <WS2812FX.h>
// WS2812FX strip = WS2812FX(NUMLEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
WS2812FX* strip;

// ***************************************************************************
// Load library "ticker" for blinking status led
// ***************************************************************************
#include <Ticker.h>
Ticker ticker;
#ifdef ENABLE_STATE_SAVE_SPIFFS
Ticker spiffs_save_state;
#endif
void tick()
{
  //toggle state
  int state = digitalRead(BUILTIN_LED);  // get the current state of GPIO1 pin
  digitalWrite(BUILTIN_LED, !state);     // set pin to the opposite state
}

#ifdef ENABLE_STATE_SAVE_EEPROM
// ***************************************************************************
// EEPROM helper
// ***************************************************************************
String readEEPROM(int offset, int len) {
  String res = "";
  for (int i = 0; i < len; ++i)
  {
    res += char(EEPROM.read(i + offset));
    //DBG_OUTPUT_PORT.println(char(EEPROM.read(i + offset)));
  }
  DBG_OUTPUT_PORT.printf("readEEPROM(): %s\n", res.c_str());
  return res;
}

void writeEEPROM(int offset, int len, String value) {
  DBG_OUTPUT_PORT.printf("writeEEPROM(): %s\n", value.c_str());
  for (int i = 0; i < len; ++i)
  {
    if (i < value.length()) {
      EEPROM.write(i + offset, value[i]);
    } else {
      EEPROM.write(i + offset, NULL);
    }
  }
}
#endif

// ***************************************************************************
// Saved state handling
// ***************************************************************************
// https://stackoverflow.com/questions/9072320/split-string-into-string-array
String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length() - 1;

  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }

  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

// ***************************************************************************
// Callback for WiFiManager library when config mode is entered
// ***************************************************************************
//gets called when WiFiManager enters configuration mode
void configModeCallback (WiFiManager *myWiFiManager) {
  DBG_OUTPUT_PORT.println("Entered config mode");
  DBG_OUTPUT_PORT.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  DBG_OUTPUT_PORT.println(myWiFiManager->getConfigPortalSSID());
  //entered config mode, make led toggle faster
  ticker.attach(0.2, tick);

  uint16_t i;
  for (i = 0; i < strip->numPixels(); i++) {
    strip->setPixelColor(i, 0, 0, 255);
  }
  strip->show();
}

//callback notifying us of the need to save config
void saveConfigCallback () {
  DBG_OUTPUT_PORT.println("Should save config");
  shouldSaveConfig = true;
}

// ***************************************************************************
// Include: Webserver
// ***************************************************************************
#include "spiffs_webserver.h"

// ***************************************************************************
// Include: Request handlers
// ***************************************************************************

// Variable to keep track of fft value received, used in vuMeter
int fftValue = 0;
#include "request_handlers.h"

#include "VUMeter.h"
#include "custom_ws2812fx_animations.h" // Add animations in this file
#ifdef CUSTOM_WS2812FX_ANIMATIONS
#endif

// function to Initialize the strip
void initStrip(uint16_t stripSize = WS2812FXStripSettings.stripSize, neoPixelType RGBOrder = WS2812FXStripSettings.RGBOrder, uint8_t pin = WS2812FXStripSettings.pin) {
  if (strip) {
    delete strip;
    WS2812FXStripSettings.stripSize = stripSize;
    WS2812FXStripSettings.RGBOrder = RGBOrder;
    WS2812FXStripSettings.pin = pin;
  }

  strip = new WS2812FX(stripSize, pin, RGBOrder + NEO_KHZ400);
  // Parameter 1 = number of pixels in strip
  // Parameter 2 = Arduino pin number (most are valid)
  // Parameter 3 = pixel type flags, add together as needed:
  //   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
  //   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
  //   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
  //   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)

  // IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
  // pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
  // and minimize distance between Arduino and first pixel.  Avoid connecting
  // on a live circuit...if you must, connect GND first.

  strip->init();
  strip->setBrightness(brightness);
  strip->setSpeed(convertSpeed(ws2812fx_speed));
  //strip->setMode(ws2812fx_mode);
  strip->setColor(main_color.red, main_color.green, main_color.blue);
  strip->setOptions(0, GAMMA);  // We only have one WS2812FX segment, set color to human readable GAMMA correction
#ifdef CUSTOM_WS2812FX_ANIMATIONS
  //  strip->setCustomMode(F("Fire 2012"), Fire2012Effect);
  strip->setCustomMode(F("VUMeter"), vuMeter);
#endif
  strip->start();
  if (mode != HOLD) mode = SET_MODE;
  saveWS2812FXStripSettings.once(3, writeStripConfigFS);
}

// ***************************************************************************
// MAIN
// ***************************************************************************
void setup() {
  //  system_update_cpu_freq(160);
  DBG_OUTPUT_PORT.begin(115200);
  EEPROM.begin(512);

  // set builtin led pin as output
  pinMode(BUILTIN_LED, OUTPUT);
  // button pin setup
#ifdef ENABLE_BUTTON
  pinMode(BUTTON, INPUT_PULLUP);
#endif
  // start ticker with 0.5 because we start in AP mode and try to connect
  ticker.attach(0.5, tick);

  // ***************************************************************************
  // Setup: SPIFFS
  // ***************************************************************************
  SPIFFS.begin();
  {
    Dir dir = SPIFFS.openDir("/");
    while (dir.next()) {
      String fileName = dir.fileName();
      size_t fileSize = dir.fileSize();
      DBG_OUTPUT_PORT.printf("FS File: %s, size: %s\n", fileName.c_str(), formatBytes(fileSize).c_str());
    }

    FSInfo fs_info;
    SPIFFS.info(fs_info);
    DBG_OUTPUT_PORT.printf("FS Usage: %d/%d bytes\n\n", fs_info.usedBytes, fs_info.totalBytes);
  }

  wifi_station_set_hostname(const_cast<char*>(HOSTNAME));

  // ***************************************************************************
  // Setup: Neopixel
  // ***************************************************************************
  readStripConfigFS(); // Read config from FS first
  initStrip();

  // ***************************************************************************
  // Setup: WiFiManager
  // ***************************************************************************
  // The extra parameters to be configured (can be either global or just in the setup)
  // After connecting, parameter.getValue() will get you the configured value
  // id/name placeholder/prompt default length

  sprintf(strip_size, "%d", WS2812FXStripSettings.stripSize);
  sprintf(led_pin, "%d", WS2812FXStripSettings.pin);

  WiFiManagerParameter custom_strip_size("strip_size", "Number of LEDs", strip_size, 5);
  WiFiManagerParameter custom_led_pin("led_pin", "LED GPIO", led_pin, 2);

  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset settings - for testing
  //  wifiManager.resetSettings();
  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);

  //set config save notify callback
  wifiManager.setSaveConfigCallback(saveConfigCallback);

  wifiManager.addParameter(&custom_strip_size);
  wifiManager.addParameter(&custom_led_pin);

  WiFi.setSleepMode(WIFI_NONE_SLEEP);

  // Uncomment if you want to restart ESP8266 if it cannot connect to WiFi.
  // Value in brackets is in seconds that WiFiManger waits until restart
#ifdef WIFIMGR_PORTAL_TIMEOUT
  wifiManager.setConfigPortalTimeout(WIFIMGR_PORTAL_TIMEOUT);
#endif

  // Uncomment if you want to set static IP
  // Order is: IP, Gateway and Subnet
#ifdef WIFIMGR_SET_MANUAL_IP
  wifiManager.setSTAStaticIPConfig(IPAddress(_ip[0], _ip[1], _ip[2], _ip[3]), IPAddress(_gw[0], _gw[1], _gw[2], _gw[3]), IPAddress(_sn[0], _sn[1], _sn[2], _sn[3]));
#endif

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if (!wifiManager.autoConnect(HOSTNAME)) {
    DBG_OUTPUT_PORT.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();  //Will be removed when upgrading to standalone offline McLightingUI version
    delay(1000);  //Will be removed when upgrading to standalone offline McLightingUI version
  }

  strcpy(strip_size, custom_strip_size.getValue());
  strcpy(led_pin, custom_led_pin.getValue());

  if (atoi(strip_size) != WS2812FXStripSettings.stripSize)
    WS2812FXStripSettings.stripSize = atoi(strip_size);
  uint8_t pin = atoi(led_pin);
  if ((pin == 16 or pin == 5 or pin == 4 or pin == 0 or pin == 2 or pin == 14 or pin == 12 or pin == 13 or pin == 15 or pin == 3 or pin == 1) and (pin != WS2812FXStripSettings.pin) )
    WS2812FXStripSettings.pin = pin;
  initStrip();

  //if you get here you have connected to the WiFi
  DBG_OUTPUT_PORT.println("connected...yeey :)");
  ticker.detach();
  //keep LED on
  digitalWrite(BUILTIN_LED, LOW);

  // ***************************************************************************
  // Setup: MDNS responder
  // ***************************************************************************
  bool mdns_result = MDNS.begin(HOSTNAME);

  DBG_OUTPUT_PORT.println("MAC Address: " + WiFi.macAddress());
  DBG_OUTPUT_PORT.print("Open http://");
  DBG_OUTPUT_PORT.print(WiFi.localIP());
  DBG_OUTPUT_PORT.println("/ to open McLighting.");

  DBG_OUTPUT_PORT.print("Use http://");
  DBG_OUTPUT_PORT.print(HOSTNAME);
  DBG_OUTPUT_PORT.println(".local/ when you have Bonjour installed.");

  DBG_OUTPUT_PORT.print("New users: Open http://");
  DBG_OUTPUT_PORT.print(WiFi.localIP());
  DBG_OUTPUT_PORT.println("/upload to upload the webpages first.");

  DBG_OUTPUT_PORT.println("");


  // ***************************************************************************
  // Setup: WebSocket server
  // ***************************************************************************
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  // ***************************************************************************
  // Setup: SPIFFS Webserver handler
  // ***************************************************************************
  //list directory
  server.on("/list", HTTP_GET, handleFileList);

  //get heap status, analog input value and all GPIO statuses in one json call
  server.on("/esp_status", HTTP_GET, []() {
    DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(21) + 1500);
    JsonObject json = jsonBuffer.to<JsonObject>();

    json["HOSTNAME"] = HOSTNAME;
    json["version"] = SKETCH_VERSION;
    json["heap"] = ESP.getFreeHeap();
    json["sketch_size"] = ESP.getSketchSize();
    json["free_sketch_space"] = ESP.getFreeSketchSpace();
    json["flash_chip_size"] = ESP.getFlashChipSize();
    json["flash_chip_real_size"] = ESP.getFlashChipRealSize();
    json["flash_chip_speed"] = ESP.getFlashChipSpeed();
    json["sdk_version"] = ESP.getSdkVersion();
    json["core_version"] = ESP.getCoreVersion();
    json["cpu_freq"] = ESP.getCpuFreqMHz();
    json["chip_id"] = ESP.getFlashChipId();
    json["led_pin"] = WS2812FXStripSettings.pin;
    json["number_leds"] = NUMLEDS;
#ifdef ENABLE_BUTTON
    json["button_mode"] = "ON";
#else
    json["button_mode"] = "OFF";
#endif
#ifdef ENABLE_STATE_SAVE_SPIFFS
    json["state_save"] = "SPIFFS";
#endif
#ifdef ENABLE_STATE_SAVE_EEPROM
    json["state_save"] = "EEPROM";
#endif

    String json_str;
    serializeJson(json, json_str);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json_str);
  });

  server.on("/", HTTP_GET, [&]() {
#ifdef USE_HTML_MIN_GZ
//    server.sendHeader("Content-Encoding", "gzip", true);
//        server.send_P(200, PSTR("text/html"), index_htm_gz, index_htm_gz_len);
    server.send(200, PSTR("text/plain"), "Hello world");
    DBG_OUTPUT_PORT.println("/");
#else
    if (!handleFileRead(server.uri()))
      handleNotFound();
#endif
  });

  server.on("/edit", HTTP_GET, [&]() {
#ifdef USE_HTML_MIN_GZ
    server.sendHeader("Content-Encoding", "gzip", true);
    server.send_P(200, PSTR("text/html"), edit_htm_gz, edit_htm_gz_len);
#else
    if (!handleFileRead(server.uri()))
      handleNotFound();
#endif
  });

  //called when the url is not defined here
  //use it to load content from SPIFFS
  server.onNotFound([]() {
    if (!handleFileRead(server.uri()))
      handleNotFound();
  });

  server.on("/upload", handleMinimalUpload);

  server.on("/restart", []() {
    DBG_OUTPUT_PORT.printf("/restart\n");
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "restarting..." );
    ESP.restart();
  });

  server.on("/reset_wlan", []() {
    DBG_OUTPUT_PORT.printf("/reset_wlan\n");
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Resetting WLAN and restarting..." );
    WiFiManager wifiManager;
    wifiManager.resetSettings();
    ESP.restart();
  });

  server.on("/start_config_ap", []() {
    DBG_OUTPUT_PORT.printf("/start_config_ap\n");
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Starting config AP ..." );
    WiFiManager wifiManager;
    wifiManager.startConfigPortal(HOSTNAME);
  });


  // ***************************************************************************
  // Setup: SPIFFS Webserver handler
  // ***************************************************************************
  server.on("/set_brightness", []() {
    getArgs();
    mode = BRIGHTNESS;
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
    getStatusJSON();
  });

  server.on("/get_brightness", []() {
    String str_brightness = String((int) (brightness / 2.55));
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", str_brightness );
    DBG_OUTPUT_PORT.print("/get_brightness: ");
    DBG_OUTPUT_PORT.println(str_brightness);
  });

  server.on("/set_speed", []() {
    if (server.arg("d").toInt() >= 0) {
      ws2812fx_speed = server.arg("d").toInt();
      ws2812fx_speed = constrain(ws2812fx_speed, 0, 255);
      strip->setSpeed(convertSpeed(ws2812fx_speed));
    }

    getStatusJSON();
  });

  server.on("/get_speed", []() {
    String str_speed = String(ws2812fx_speed);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", str_speed );
    DBG_OUTPUT_PORT.print("/get_speed: ");
    DBG_OUTPUT_PORT.println(str_speed);
  });

  server.on("/get_switch", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", (mode == OFF) ? "0" : "1" );
    DBG_OUTPUT_PORT.printf("/get_switch: %s\n", (mode == OFF) ? "0" : "1");
  });

  server.on("/get_color", []() {
    char rgbcolor[7];
    snprintf(rgbcolor, sizeof(rgbcolor), "%02X%02X%02X", main_color.red, main_color.green, main_color.blue);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", rgbcolor );
    DBG_OUTPUT_PORT.print("/get_color: ");
    DBG_OUTPUT_PORT.println(rgbcolor);
  });

  server.on("/status", []() {
    getStatusJSON();
  });

  server.on("/pixelconf", []() {

    /*

      // This will be used later when web-interface is ready and HTTP_GET will not be allowed to update the Strip Settings

      if(server.args() == 0 and server.method() != HTTP_POST)
      {
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(200, "text/plain", "Only HTTP POST method is allowed and check the number of arguments!");
      return;
      }

    */

    bool updateStrip = false;
    if (server.hasArg("ct")) {
      uint16_t pixelCt = server.arg("ct").toInt();
      if (pixelCt > 0) {
        WS2812FXStripSettings.stripSize = pixelCt;
        updateStrip = true;
        DBG_OUTPUT_PORT.printf("/pixels: Count# %d\n", pixelCt);
      }
    }
    if (server.hasArg("rgbo")) {
      String RGBOrder = server.arg("rgbo");
      DBG_OUTPUT_PORT.print("/pixels: RGB Order# ");
      if (RGBOrder == "grb") {
        WS2812FXStripSettings.RGBOrder = NEO_GRB;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else if (RGBOrder == "gbr") {
        WS2812FXStripSettings.RGBOrder = NEO_GBR;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else if (RGBOrder == "rgb") {
        WS2812FXStripSettings.RGBOrder = NEO_RGB;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else if (RGBOrder == "rbg") {
        WS2812FXStripSettings.RGBOrder = NEO_RBG;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else if (RGBOrder == "brg") {
        WS2812FXStripSettings.RGBOrder = NEO_BRG;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else if (RGBOrder == "bgr") {
        WS2812FXStripSettings.RGBOrder = NEO_BGR;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(RGBOrder);
      } else {
        DBG_OUTPUT_PORT.println("invalid input!");
      }
    }
    if (server.hasArg("pin")) {
      uint8_t pin = server.arg("pin").toInt();
      DBG_OUTPUT_PORT.print("/pixels: GPIO used# ");
      if (pin == 16 or pin == 5 or pin == 4 or pin == 0 or pin == 2 or pin == 14 or pin == 12 or pin == 13 or pin == 15 or pin == 3 or pin == 1) {
        WS2812FXStripSettings.pin = pin;
        updateStrip = true;
        DBG_OUTPUT_PORT.println(pin);
      } else {
        DBG_OUTPUT_PORT.println("invalid input!");
      }
    }

    if (updateStrip)
    {
      ws2812fx_mode = strip->getMode();
      if (strip->isRunning()) strip->stop();
      initStrip();
      strip->setMode(ws2812fx_mode);
      strip->trigger();
    }

    DynamicJsonDocument jsonBuffer(200);
    JsonObject json = jsonBuffer.to<JsonObject>();
    json["pixel_count"] = WS2812FXStripSettings.stripSize;
    json["rgb_order"] = WS2812FXStripSettings.RGBOrder;
    json["pin"] = WS2812FXStripSettings.pin;
    String json_str;
    serializeJson(json, json_str);
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json_str);
  });

  server.on("/off", []() {
    mode = OFF;
    getArgs();
    getStatusJSON();
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  });

  server.on("/all", []() {
    ws2812fx_mode = FX_MODE_STATIC;
    mode = SET_MODE;
    //mode = ALL;
    getArgs();
    getStatusJSON();
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  });

  server.on("/get_modes", []() {
    getModesJSON();
  });

  server.on("/set_mode", []() {
    getArgs();
    mode = SET_MODE;
    getStatusJSON();

#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  });

  server.begin();

  // Start MDNS service
  if (mdns_result) {
    MDNS.addService("http", "tcp", 80);
  }

#ifdef ENABLE_STATE_SAVE_SPIFFS
  (readStateFS()) ? DBG_OUTPUT_PORT.println(" Success!") : DBG_OUTPUT_PORT.println(" Failure!");
#endif
#ifdef ENABLE_STATE_SAVE_EEPROM
  // Load state string from EEPROM
  String saved_state_string = readEEPROM(256, 32);
  String chk = getValue(saved_state_string, '|', 0);
  if (chk == "STA") {
    DBG_OUTPUT_PORT.printf("Found saved state: %s\n", saved_state_string.c_str());
    setModeByStateString(saved_state_string);
  }
  sprintf(last_state, "STA|%2d|%3d|%3d|%3d|%3d|%3d|%3d", mode, ws2812fx_mode, ws2812fx_speed, brightness, main_color.red, main_color.green, main_color.blue);
#endif
}


void loop() {
#ifdef ENABLE_BUTTON
  button();
#endif
  server.handleClient();
  webSocket.loop();

  // Simple statemachine that handles the different modes
  strip->service();
  if (mode == SET_MODE) {
    DBG_OUTPUT_PORT.printf("SET_MODE: %d %d\n", ws2812fx_mode, mode);
    if (strip) strip->setMode(ws2812fx_mode);
    if (strip) strip->trigger();
    prevmode = SET_MODE;
    mode = SETCOLOR;
  }
  if (mode == OFF) {
    if (strip) {
      if (strip->isRunning()) strip->stop(); //should clear memory
      // mode = HOLD;
    }
  }
  if (mode == SETCOLOR) {
    if (strip) strip->setColor(main_color.red, main_color.green, main_color.blue);
    if (strip) strip->trigger();
    mode = (prevmode == SET_MODE) ? SETSPEED : HOLD;
  }
  if (mode == SETSPEED) {
    if (strip) strip->setSpeed(convertSpeed(ws2812fx_speed));
    if (strip) strip->trigger();
    mode = (prevmode == SET_MODE) ? BRIGHTNESS : HOLD;
  }
  if (mode == BRIGHTNESS) {
    if (strip) strip->setBrightness(brightness);
    if (strip) strip->trigger();
    if (prevmode == SET_MODE) prevmode = HOLD;
    mode = HOLD;
  }
  if (mode == HOLD || mode == CUSTOM) {
    if (strip)
    {
      if (!strip->isRunning()) strip->start();
    }
    if (prevmode == SET_MODE) prevmode = HOLD;
  }

  // Only for modes with WS2812FX functionality
  if (mode != CUSTOM) {
    if (strip) strip->service();
  }

#ifdef ENABLE_STATE_SAVE_SPIFFS
  if (updateStateFS) {
    (writeStateFS()) ? DBG_OUTPUT_PORT.println(" Success!") : DBG_OUTPUT_PORT.println(" Failure!");
  }
#endif

#ifdef ENABLE_STATE_SAVE_EEPROM
  // Check for state changes
  sprintf(current_state, "STA|%2d|%3d|%3d|%3d|%3d|%3d|%3d", mode, strip->getMode(), ws2812fx_speed, brightness, main_color.red, main_color.green, main_color.blue);

  if (strcmp(current_state, last_state) != 0) {
    // DBG_OUTPUT_PORT.printf("STATE CHANGED: %s / %s\n", last_state, current_state);
    strcpy(last_state, current_state);
    time_statechange = millis();
    state_save_requested = true;
  }
  if (state_save_requested && time_statechange + timeout_statechange_save <= millis()) {
    time_statechange = 0;
    state_save_requested = false;
    writeEEPROM(256, 32, last_state); // 256 --> last_state (reserved 32 bytes)
    EEPROM.commit();
  }
#endif
}
