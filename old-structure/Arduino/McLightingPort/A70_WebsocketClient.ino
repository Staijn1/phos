WebSocketsClient webSocketClient;

void setupWebsocketClient() {
  Serial.print("[WSc SETUP] Connecting to server with IP: ");
  Serial.println(preferences.getString("serverip"));
  // Start connection
  webSocketClient.begin(preferences.getString("serverip"), 81, "/");
  // event handler
  webSocketClient.onEvent(webSocketClientEvent);

  // try ever 5000 again if connection has failed
  webSocketClient.setReconnectInterval(5000);
}

void runWebsocketClient() {
  webSocketClient.loop();
}


void webSocketClientEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected from server!\n");
      break;
    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to url: %s\n", payload);
      break;
    case WStype_TEXT: {
        Serial.printf("[WSc] Got text from server: %s\n", payload);
        bool recognizedCommand = checkpayloadclient(payload);

        if (!recognizedCommand) {
          Serial.print("[WSc] Command not found: ");
          Serial.println((char*)payload);
        }

        break;
      }
    case WStype_BIN:
      Serial.printf("[WSc] get binary length: %u\n", length);
      break;
    case WStype_ERROR:
      Serial.printf("[WSc] Error occured: %s", payload);
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

bool checkpayloadclient(uint8_t* payload) {
  // # ==> Set main color
  if (payload[0] == '#') {
    handleSetMainColor(payload);
    Serial.printf("Set main color to: R: [%u] G: [%u] B: [%u]\n",  main_color.red, main_color.green, main_color.blue);
    return true;
  }

  // ? ==> Set speed
  if (payload[0] == '?') {
    uint8_t d = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    ws2812fx_speed = constrain(d, 0, 255);
    updateSpeed();

    Serial.printf("Set speed to: [%u]\n", ws2812fx_speed);
    return true;
  }

  // % ==> Set brightness
  if (payload[0] == '%') {
    uint8_t tempBrightness = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    ws2812fx_brightness = constrain(tempBrightness, 0, 255);
    updateBrightness();

    Serial.printf("WS: Set brightness to: [%u]\n", ws2812fx_brightness);
    return true;
  }

  // / ==> Set WS2812 mode.
  if (payload[0] == '/') {
    handleSetWS2812FXMode(payload);
    Serial.printf("Set WS2812 mode: [%s]\n", payload);
    return true;
  }

  // . ==> (CUSTOM) Set FFT value, to display in music mode
  if (payload[0] == '.') {
    int tmpFFTValue = (int) strtol((const char *) &payload[1], NULL, 10);
    fftValue = constrain(tmpFFTValue, 0, 255);
    return true;
  }

  return false;
}
void checkpayloadserver(uint8_t* payload, uint8_t num = 0) {
  bool recognizedCommand = checkpayloadclient(payload);

  // $ ==> Get status Info.
  if (payload[0] == '$') {
    String json = listStatusJSON();
//    webSocketClient.sendTXT(num, "OK");
//    webSocketClient.sendTXT(num, json);
    Serial.println("Get status info: " + json);
    return;
  }

  // ~ ==> Get WS2812 modes.
  if (payload[0] == '~') {
    String json = listModesJSON();

    Serial.print("WS: ");
//    webSocketClient.sendTXT(num, "OK");
//    webSocketClient.sendTXT(num, json);
    Serial.println("Get WS2812 modes.");
    Serial.println(json);
    return;
  }

  if (!recognizedCommand) {
//    webSocketClient.sendTXT(num, "COMMAND NOT FOUND");
  }
}
