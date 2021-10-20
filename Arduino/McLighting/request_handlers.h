// ***************************************************************************
// Request handlers
// ***************************************************************************
#ifdef ENABLE_STATE_SAVE_SPIFFS
void tickerSpiffsSaveState() {
  updateStateFS = true;
}
#endif

void getArgs() {
  if (server.arg("rgb") != "") {
    uint32_t rgb = (uint32_t) strtol(server.arg("rgb").c_str(), NULL, 16);
    main_color.red = ((rgb >> 16) & 0xFF);
    main_color.green = ((rgb >> 8) & 0xFF);
    main_color.blue = ((rgb >> 0) & 0xFF);
  } else {
    main_color.red = server.arg("r").toInt();
    main_color.green = server.arg("g").toInt();
    main_color.blue = server.arg("b").toInt();
  }
  ws2812fx_speed = constrain(server.arg("s").toInt(), 0, 255);
  if (server.arg("s") == "") {
    ws2812fx_speed = 196;
  }

  if (server.arg("m") != "") {
    ws2812fx_mode = constrain(server.arg("m").toInt(), 0, strip->getModeCount() - 1);
  }

  if (server.arg("c").toInt() > 0) {
    brightness = constrain((int) server.arg("c").toInt() * 2.55, 0, 255);
  } else if (server.arg("p").toInt() > 0) {
    brightness = constrain(server.arg("p").toInt(), 0, 255);
  }

  main_color.red = constrain(main_color.red, 0, 255);
  main_color.green = constrain(main_color.green, 0, 255);
  main_color.blue = constrain(main_color.blue, 0, 255);

  DBG_OUTPUT_PORT.print("Mode: ");
  DBG_OUTPUT_PORT.print(mode);
  DBG_OUTPUT_PORT.print(", Color: ");
  DBG_OUTPUT_PORT.print(main_color.red);
  DBG_OUTPUT_PORT.print(", ");
  DBG_OUTPUT_PORT.print(main_color.green);
  DBG_OUTPUT_PORT.print(", ");
  DBG_OUTPUT_PORT.print(main_color.blue);
  DBG_OUTPUT_PORT.print(", Speed:");
  DBG_OUTPUT_PORT.print(ws2812fx_speed);
  DBG_OUTPUT_PORT.print(", Brightness:");
  DBG_OUTPUT_PORT.println(brightness);
}


uint16_t convertSpeed(uint8_t mcl_speed) {
  //long ws2812_speed = mcl_speed * 256;
  uint16_t ws2812_speed = 61760 * (exp(0.0002336 * mcl_speed) - exp(-0.03181 * mcl_speed));
  ws2812_speed = SPEED_MAX - ws2812_speed;
  if (ws2812_speed < SPEED_MIN) {
    ws2812_speed = SPEED_MIN;
  }
  if (ws2812_speed > SPEED_MAX) {
    ws2812_speed = SPEED_MAX;
  }
  return ws2812_speed;
}


// ***************************************************************************
// Handler functions for WS and MQTT
// ***************************************************************************
void handleSetMainColor(uint8_t * mypayload) {
  // decode rgb data
  uint32_t rgb = (uint32_t) strtol((const char *) &mypayload[1], NULL, 16);
  main_color.red = ((rgb >> 16) & 0xFF);
  main_color.green = ((rgb >> 8) & 0xFF);
  main_color.blue = ((rgb >> 0) & 0xFF);
  //  strip->setColor(main_color.red, main_color.green, main_color.blue);
  mode = SETCOLOR;
}

void handleSetAllMode(uint8_t * mypayload) {
  // decode rgb data
  uint32_t rgb = (uint32_t) strtol((const char *) &mypayload[1], NULL, 16);

  main_color.red = ((rgb >> 16) & 0xFF);
  main_color.green = ((rgb >> 8) & 0xFF);
  main_color.blue = ((rgb >> 0) & 0xFF);

  DBG_OUTPUT_PORT.printf("WS: Set all leds to main color: [%u] [%u] [%u]\n", main_color.red, main_color.green, main_color.blue);
  ws2812fx_mode = FX_MODE_STATIC;
  mode = SET_MODE;
}

void handleSetSingleLED(uint8_t * mypayload, uint8_t firstChar = 0) {
  // decode led index
  char templed[3];
  strncpy (templed, (const char *) &mypayload[firstChar], 2 );
  uint8_t led = atoi(templed);

  DBG_OUTPUT_PORT.printf("led value: [%i]. Entry threshold: <= [%i] (=> %s)\n", led, strip->numPixels(), mypayload );
  if (led <= strip->numPixels()) {
    char redhex[3];
    char greenhex[3];
    char bluehex[3];
    strncpy (redhex, (const char *) &mypayload[2 + firstChar], 2 );
    strncpy (greenhex, (const char *) &mypayload[4 + firstChar], 2 );
    strncpy (bluehex, (const char *) &mypayload[6 + firstChar], 2 );
    redhex[2] = 0x00;
    greenhex[2] = 0x00;
    bluehex[2] = 0x00;
    ledstates[led].red =   strtol(redhex, NULL, 16);
    ledstates[led].green = strtol(greenhex, NULL, 16);
    ledstates[led].blue =  strtol(bluehex, NULL, 16);
    DBG_OUTPUT_PORT.printf("rgb.red: [%s] rgb.green: [%s] rgb.blue: [%s]\n", redhex, greenhex, bluehex);
    DBG_OUTPUT_PORT.printf("rgb.red: [%i] rgb.green: [%i] rgb.blue: [%i]\n", strtol(redhex, NULL, 16), strtol(greenhex, NULL, 16), strtol(bluehex, NULL, 16));
    DBG_OUTPUT_PORT.printf("WS: Set single led [%i] to [%i] [%i] [%i] (%s)!\n", led, ledstates[led].red, ledstates[led].green, ledstates[led].blue, mypayload);


    strip->setPixelColor(led, ledstates[led].red, ledstates[led].green, ledstates[led].blue);
    strip->show();
  }
  mode = CUSTOM;
}

void handleSetDifferentColors(uint8_t * mypayload) {
  uint8_t* nextCommand = 0;
  nextCommand = (uint8_t*) strtok((char*) mypayload, "+");
  while (nextCommand) {
    handleSetSingleLED(nextCommand, 0);
    nextCommand = (uint8_t*) strtok(NULL, "+");
  }
}

void handleRangeDifferentColors(uint8_t * mypayload) {
  uint8_t* nextCommand = 0;
  nextCommand = (uint8_t*) strtok((char*) mypayload, "R");
  // While there is a range to process R0110<00ff00>

  while (nextCommand) {
    // Loop for each LED.
    char startled[3] = { 0, 0, 0 };
    char endled[3] = { 0, 0, 0 };
    char colorval[7] = { 0, 0, 0, 0, 0, 0, 0 };
    strncpy ( startled, (const char *) &nextCommand[0], 2 );
    strncpy ( endled, (const char *) &nextCommand[2], 2 );
    strncpy ( colorval, (const char *) &nextCommand[4], 6 );
    int rangebegin = atoi(startled);
    int rangeend = atoi(endled);
    DBG_OUTPUT_PORT.printf("Setting RANGE from [%i] to [%i] as color [%s] \n", rangebegin, rangeend, colorval);

    while ( rangebegin <= rangeend ) {
      char rangeData[9] = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };
      if ( rangebegin < 10 ) {
        // Create the valid 'nextCommand' structure
        sprintf(rangeData, "0%d%s", rangebegin, colorval);
      }
      if ( rangebegin >= 10 ) {
        // Create the valid 'nextCommand' structure
        sprintf(rangeData, "%d%s", rangebegin, colorval);
      }
      // Set one LED
      handleSetSingleLED((uint8_t*) rangeData, 0);
      rangebegin++;
    }

    // Next Range at R
    nextCommand = (uint8_t*) strtok(NULL, "R");
  }
}

void setModeByStateString(String saved_state_string) {
  String str_mode = getValue(saved_state_string, '|', 1);
  mode = static_cast<MODE>(str_mode.toInt());
  String str_ws2812fx_mode = getValue(saved_state_string, '|', 2);
  ws2812fx_mode = str_ws2812fx_mode.toInt();
  String str_ws2812fx_speed = getValue(saved_state_string, '|', 3);
  ws2812fx_speed = str_ws2812fx_speed.toInt();
  String str_brightness = getValue(saved_state_string, '|', 4);
  brightness = str_brightness.toInt();
  String str_red = getValue(saved_state_string, '|', 5);
  main_color.red = str_red.toInt();
  String str_green = getValue(saved_state_string, '|', 6);
  main_color.green = str_green.toInt();
  String str_blue = getValue(saved_state_string, '|', 7);
  main_color.blue = str_blue.toInt();

  DBG_OUTPUT_PORT.printf("ws2812fx_mode: %d\n", ws2812fx_mode);
  DBG_OUTPUT_PORT.printf("ws2812fx_speed: %d\n", ws2812fx_speed);
  DBG_OUTPUT_PORT.printf("brightness: %d\n", brightness);
  DBG_OUTPUT_PORT.printf("main_color.red: %d\n", main_color.red);
  DBG_OUTPUT_PORT.printf("main_color.green: %d\n", main_color.green);
  DBG_OUTPUT_PORT.printf("main_color.blue: %d\n", main_color.blue);

  strip->setMode(ws2812fx_mode);
  strip->setSpeed(convertSpeed(ws2812fx_speed));
  strip->setBrightness(brightness);
  strip->setColor(main_color.red, main_color.green, main_color.blue);
}

void handleSetWS2812FXMode(uint8_t * mypayload) {
  mode = SET_MODE;
  uint8_t ws2812fx_mode_tmp = (uint8_t) strtol((const char *) &mypayload[1], NULL, 10);
  ws2812fx_mode = constrain(ws2812fx_mode_tmp, 0, strip->getModeCount() - 1);

  Serial.println(strip->getModeName(strip->getMode()));
  if (ws2812fx_mode == FX_MODE_CUSTOM) {

    strip->setSegment(0, 0, NUMLEDS - 1, FX_MODE_CUSTOM, strip->getColor(), 0, NO_OPTIONS);
  }
}

String listStatusJSON(void) {
  uint8_t tmp_mode = (mode == SET_MODE) ? (uint8_t) ws2812fx_mode : strip->getMode();

  const size_t bufferSize = JSON_ARRAY_SIZE(3) + JSON_OBJECT_SIZE(6) + 500;
  DynamicJsonDocument jsonBuffer(bufferSize);
  JsonObject root = jsonBuffer.to<JsonObject>();
  root["mode"] = (uint8_t) mode;
  root["ws2812fx_mode"] = tmp_mode;
  root["ws2812fx_mode_name"] = strip->getModeName(tmp_mode);
  root["speed"] = ws2812fx_speed;
  root["brightness"] = brightness;
  JsonArray color = root.createNestedArray("color");
  color.add(main_color.red);
  color.add(main_color.green);
  color.add(main_color.blue);

  String json;
  serializeJson(root, json);

  return json;
}

void getStatusJSON() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send ( 200, "application/json", listStatusJSON() );
}

String listModesJSON(void) {
  const size_t bufferSize = JSON_ARRAY_SIZE(strip->getModeCount() + 1) + strip->getModeCount() * JSON_OBJECT_SIZE(2) + 1000;
  DynamicJsonDocument jsonBuffer(bufferSize);
  JsonArray json = jsonBuffer.to<JsonArray>();
  for (uint8_t i = 0; i < strip->getModeCount(); i++) {
    JsonObject object = json.createNestedObject();
    object["mode"] = i;
    object["name"] = strip->getModeName(i);
  }
  JsonObject object = json.createNestedObject();

  String json_str;
  serializeJson(json, json_str);
  return json_str;
}

void getModesJSON() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send ( 200, "application/json", listModesJSON() );
}

// ***************************************************************************
// HTTP request handlers
// ***************************************************************************
void handleMinimalUpload() {
  char temp[1500];

  snprintf ( temp, 1500,
             "<!DOCTYPE html>\
    <html>\
      <head>\
        <title>ESP8266 Upload</title>\
        <meta charset=\"utf-8\">\
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\
      </head>\
      <body>\
        <form action=\"/edit\" method=\"post\" enctype=\"multipart/form-data\">\
          <input type=\"file\" name=\"data\">\
          <input type=\"text\" name=\"path\" value=\"/\">\
          <button>Upload</button>\
         </form>\
      </body>\
    </html>"
           );
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send ( 200, "text/html", temp );
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += ( server.method() == HTTP_GET ) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for ( uint8_t i = 0; i < server.args(); i++ ) {
    message += " " + server.argName ( i ) + ": " + server.arg ( i ) + "\n";
  }
  server.send ( 404, "text/plain", message );
}

// automatic cycling
Ticker autoTicker;
int autoCount = 0;

void autoTick() {
  strip->setColor(autoParams[autoCount][0]);
  strip->setSpeed(convertSpeed((uint8_t)autoParams[autoCount][1]));
  strip->setMode((uint8_t)autoParams[autoCount][2]);
  autoTicker.once_ms((uint32_t)autoParams[autoCount][3], autoTick);
  DBG_OUTPUT_PORT.printf("autoTick[%d]: {0x%06x, %d, %d, %d}\n", autoCount, autoParams[autoCount][0], (uint8_t)autoParams[autoCount][1], (uint8_t)autoParams[autoCount][2], (uint32_t)autoParams[autoCount][3]);

  autoCount++;
  if (autoCount >= (sizeof(autoParams) / sizeof(autoParams[0]))) autoCount = 0;
}

void handleAutoStart() {
  autoCount = 0;
  autoTick();
  strip->start();
}

void handleAutoStop() {
  autoTicker.detach();
  strip->stop();
}

void checkpayload(uint8_t * payload, bool mqtt = false, uint8_t num = 0) {
  // # ==> Set main color
  if (payload[0] == '#') {
    handleSetMainColor(payload);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set main color to: R: [%u] G: [%u] B: [%u]\n",  main_color.red, main_color.green, main_color.blue);
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  }

  // ? ==> Set speed
  if (payload[0] == '?') {
    uint8_t d = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    ws2812fx_speed = constrain(d, 0, 255);
    mode = SETSPEED;
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set speed to: [%u]\n", ws2812fx_speed);
  }

  // % ==> Set brightness
  if (payload[0] == '%') {
    uint8_t b = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    brightness = constrain(b, 0, 255);
    mode = BRIGHTNESS;
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("WS: Set brightness to: [%u]\n", brightness);
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  }

  // * ==> Set main color and light all LEDs (Shortcut)
  if (payload[0] == '*') {
    handleSetAllMode(payload);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set main color and light all LEDs [%s]\n", payload);
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  }

  // ! ==> Set single LED in given color
  if (payload[0] == '!') {
    handleSetSingleLED(payload, 1);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set single LED in given color [%s]\n", payload);
  }

  // + ==> Set multiple LED in the given colors
  if (payload[0] == '+') {
    handleSetDifferentColors(payload);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set multiple LEDs in given color [%s]\n", payload);
  }

  // + ==> Set range of LEDs in the given color
  if (payload[0] == 'R') {
    handleRangeDifferentColors(payload);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set range of LEDs in given color [%s]\n", payload);
    webSocket.sendTXT(num, "OK");
  }

  // $ ==> Get status Info.
  if (payload[0] == '$') {
    String json = listStatusJSON();
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
      webSocket.sendTXT(num, json);
    }
    DBG_OUTPUT_PORT.println("Get status info: " + json);
  }

  // ~ ==> Get WS2812 modes.
  if (payload[0] == '~') {
    String json = listModesJSON();
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
      webSocket.sendTXT(num, json);
    }
    DBG_OUTPUT_PORT.println("Get WS2812 modes.");
    DBG_OUTPUT_PORT.println(json);
  }

  // / ==> Set WS2812 mode.
  if (payload[0] == '/') {
    handleSetWS2812FXMode(payload);
    if (mqtt == true)  {
      DBG_OUTPUT_PORT.print("MQTT: ");
    } else {
      DBG_OUTPUT_PORT.print("WS: ");
      webSocket.sendTXT(num, "OK");
    }
    DBG_OUTPUT_PORT.printf("Set WS2812 mode: [%s]\n", payload);
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  }

  // . ==> (CUSTOM) Set FFT value, to display in music mode
  if (payload[0] == '.') {
    int tmpFFTValue = (int) strtol((const char *) &payload[1], NULL, 10);
    fftValue = constrain(tmpFFTValue, 0, 255);
  }
}

// ***************************************************************************
// WS request handlers
// ***************************************************************************
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {
  switch (type) {
    case WStype_DISCONNECTED:
      DBG_OUTPUT_PORT.printf("WS: [%u] Disconnected!\n", num);
      break;

    case WStype_CONNECTED: {
        IPAddress ip = webSocket.remoteIP(num);
        DBG_OUTPUT_PORT.printf("WS: [%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
        webSocket.sendTXT(num, "Connected");
      }
      break;

    case WStype_TEXT:
      DBG_OUTPUT_PORT.printf("WS: [%u] get Text: %s\n", num, payload);

      checkpayload(payload, false, num);

      // start auto cycling
      if (strcmp((char *)payload, "start") == 0 ) {
        handleAutoStart();
        webSocket.sendTXT(num, "OK");
      }

      // stop auto cycling
      if (strcmp((char *)payload, "stop") == 0 ) {
        handleAutoStop();
        webSocket.sendTXT(num, "OK");
      }
      break;
  }
}

void checkForRequests() {
  webSocket.loop();
  server.handleClient();
}

// ***************************************************************************
// Button management
// ***************************************************************************
#ifdef ENABLE_BUTTON
void shortKeyPress() {
  DBG_OUTPUT_PORT.printf("Short button press\n");
  if (buttonState == false) {
    setModeByStateString(BTN_MODE_SHORT);
    buttonState = true;
  } else {
    mode = OFF;
    buttonState = false;
#ifdef ENABLE_STATE_SAVE_SPIFFS
    if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
  }
}

// called when button is kept pressed for less than 2 seconds
void mediumKeyPress() {
  DBG_OUTPUT_PORT.printf("Medium button press\n");
  setModeByStateString(BTN_MODE_MEDIUM);
#ifdef ENABLE_STATE_SAVE_SPIFFS
  if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
}

// called when button is kept pressed for 2 seconds or more
void longKeyPress() {
  DBG_OUTPUT_PORT.printf("Long button press\n");
  setModeByStateString(BTN_MODE_LONG);
#ifdef ENABLE_STATE_SAVE_SPIFFS
  if (!spiffs_save_state.active()) spiffs_save_state.once(3, tickerSpiffsSaveState);
#endif
}

void button() {
  if (millis() - keyPrevMillis >= keySampleIntervalMs) {
    keyPrevMillis = millis();

    byte currKeyState = digitalRead(BUTTON);

    if ((prevKeyState == HIGH) && (currKeyState == LOW)) {
      // key goes from not pressed to pressed
      KeyPressCount = 0;
    }
    else if ((prevKeyState == LOW) && (currKeyState == HIGH)) {
      if (KeyPressCount < longKeyPressCountMax && KeyPressCount >= mediumKeyPressCountMin) {
        mediumKeyPress();
      }
      else {
        if (KeyPressCount < mediumKeyPressCountMin) {
          shortKeyPress();
        }
      }
    }
    else if (currKeyState == LOW) {
      KeyPressCount++;
      if (KeyPressCount >= longKeyPressCountMax) {
        longKeyPress();
      }
    }
    prevKeyState = currKeyState;
  }
}
#endif

#ifdef ENABLE_STATE_SAVE_SPIFFS
bool updateFS = false;


bool writeStateFS() {
  updateFS = true;
  //save the strip state to FS JSON
  DBG_OUTPUT_PORT.print("Saving cfg: ");
  DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(7) + 200);
  JsonObject json = jsonBuffer.to<JsonObject>();
  json["mode"] = static_cast<int>(mode);
  json["strip_mode"] = (int) strip->getMode();
  json["brightness"] = brightness;
  json["speed"] = ws2812fx_speed;
  json["red"] = main_color.red;
  json["green"] = main_color.green;
  json["blue"] = main_color.blue;

  //SPIFFS.remove("/stripstate.json") ? DBG_OUTPUT_PORT.println("removed file") : DBG_OUTPUT_PORT.println("failed removing file");
  File configFile = SPIFFS.open("/stripstate.json", "w");
  if (!configFile) {
    DBG_OUTPUT_PORT.println("Failed!");
    updateFS = false;
    spiffs_save_state.detach();
    updateStateFS = false;
    return false;
  }
  serializeJson(json, DBG_OUTPUT_PORT);
  serializeJson(json, configFile);
  configFile.close();
  updateFS = false;
  spiffs_save_state.detach();
  updateStateFS = false;
  return true;
  //end save
}

bool readStateFS() {
  //read strip state from FS JSON
  updateFS = true;
  //if (resetsettings) { SPIFFS.begin(); SPIFFS.remove("/config.json"); SPIFFS.format(); delay(1000);}
  if (SPIFFS.exists("/stripstate.json")) {
    //file exists, reading and loading
    DBG_OUTPUT_PORT.print("Read cfg: ");
    File configFile = SPIFFS.open("/stripstate.json", "r");
    if (configFile) {
      size_t size = configFile.size();
      // Allocate a buffer to store contents of the file.
      std::unique_ptr<char[]> buf(new char[size]);
      configFile.readBytes(buf.get(), size);
      DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(7) + 200);
      DeserializationError error = deserializeJson(jsonBuffer, buf.get());
      if (!error) {
        JsonObject json = jsonBuffer.as<JsonObject>();
        serializeJson(json, DBG_OUTPUT_PORT);
        mode = static_cast<MODE>(json["mode"].as<int>());
        ws2812fx_mode = json["strip_mode"].as<int>();
        brightness = json["brightness"].as<int>();
        ws2812fx_speed = json["speed"].as<int>();
        main_color.red = json["red"].as<int>();
        main_color.green = json["green"].as<int>();
        main_color.blue = json["blue"].as<int>();

        strip->setMode(ws2812fx_mode);
        strip->setSpeed(convertSpeed(ws2812fx_speed));
        strip->setBrightness(brightness);
        strip->setColor(main_color.red, main_color.green, main_color.blue);

        updateFS = false;
        return true;
      } else {
        DBG_OUTPUT_PORT.println("Failed to parse JSON!");
      }
    } else {
      DBG_OUTPUT_PORT.println("Failed to open \"/stripstate.json\"");
    }
  } else {
    DBG_OUTPUT_PORT.println("Couldn't find \"/stripstate.json\"");
  }
  //end read
  updateFS = false;
  return false;
}
#endif

//Strip Config
char strip_size[4], led_pin[3]; //needed for WiFiManager Settings

struct
{
  uint16_t stripSize = NUMLEDS;
  uint8_t RGBOrder = NEO_GRB;
  uint8_t pin = LED_PIN;
} WS2812FXStripSettings;

Ticker saveWS2812FXStripSettings;

bool readStripConfigFS(void) {
  //read stripconfiguration from FS JSON
  updateFS = true;
  if (SPIFFS.exists("/neoconfig.json")) {
    //file exists, reading and loading
    DBG_OUTPUT_PORT.print("Reading neoconfig file... ");
    File configFile = SPIFFS.open("/neoconfig.json", "r");
    if (configFile) {
      DBG_OUTPUT_PORT.println("Opened!");
      size_t size = configFile.size();
      std::unique_ptr<char[]> buf(new char[size]);
      configFile.readBytes(buf.get(), size);
      DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(4) + 300);
      DeserializationError error = deserializeJson(jsonBuffer, buf.get());
      DBG_OUTPUT_PORT.print("neoconfig.json: ");
      if (!error) {
        DBG_OUTPUT_PORT.println("Parsed!");
        JsonObject json = jsonBuffer.as<JsonObject>();
        serializeJson(json, DBG_OUTPUT_PORT);
        WS2812FXStripSettings.stripSize = (json["pixel_count"].as<uint16_t>()) ? json["pixel_count"].as<uint16_t>() : NUMLEDS;
        WS2812FXStripSettings.RGBOrder = json["rgb_order"].as<int>();
        WS2812FXStripSettings.pin = json["pin"].as<int>();
        updateFS = false;
        return true;
      } else {
        DBG_OUTPUT_PORT.print("Failed to load json config: ");
        DBG_OUTPUT_PORT.println(error.c_str());
      }
    } else {
      DBG_OUTPUT_PORT.println("Failed to open /config.json");
    }
  } else {
    DBG_OUTPUT_PORT.println("Couldn't find config.json");
  }
  //end read
  updateFS = false;
  return false;
}

void writeStripConfigFS(void) {
  updateFS = true;
  //save the strip config to FS JSON
  DBG_OUTPUT_PORT.print("Saving Strip cfg: ");
  DynamicJsonDocument jsonBuffer(JSON_OBJECT_SIZE(4) + 300);
  JsonObject json = jsonBuffer.to<JsonObject>();
  json["pixel_count"] = WS2812FXStripSettings.stripSize;
  json["rgb_order"] = WS2812FXStripSettings.RGBOrder;
  json["pin"] = WS2812FXStripSettings.pin;

  //SPIFFS.remove("/neoconfig.json") ? DBG_OUTPUT_PORT.println("removed file") : DBG_OUTPUT_PORT.println("failed removing file");
  File configFile = SPIFFS.open("/neoconfig.json", "w");
  if (!configFile) {
    DBG_OUTPUT_PORT.println("Failed!");
    updateFS = false;
  }
  serializeJson(json, DBG_OUTPUT_PORT);
  serializeJson(json, configFile);
  DBG_OUTPUT_PORT.println();
  configFile.close();
  updateFS = false;
  //end save
}
