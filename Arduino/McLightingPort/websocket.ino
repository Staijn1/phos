
WebSocketsServer webSocket = WebSocketsServer(81);
void setupWebsocketServer() {
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void runWebsocketServer() {
  webSocket.loop();
}


void checkpayload(uint8_t* payload, uint8_t num = 0) {
  // # ==> Set main color
  if (payload[0] == '#') {
    handleSetMainColor(payload);
    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");

    Serial.printf("Set main color to: R: [%u] G: [%u] B: [%u]\n",  main_color.red, main_color.green, main_color.blue);
    return;
  }

  // ? ==> Set speed
  if (payload[0] == '?') {
    uint8_t d = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    ws2812fx_speed = constrain(d, 0, 255);
    updateSpeed();
    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");

    Serial.printf("Set speed to: [%u]\n", ws2812fx_speed);
    return;
  }

  // % ==> Set brightness
  if (payload[0] == '%') {
    uint8_t tempBrightness = (uint8_t) strtol((const char *) &payload[1], NULL, 10);
    ws2812fx_brightness = constrain(tempBrightness, 0, 255);
    updateBrightness();
    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");

    Serial.printf("WS: Set brightness to: [%u]\n", ws2812fx_brightness);
    return;
  }

  // $ ==> Get status Info.
  if (payload[0] == '$') {
    String json = listStatusJSON();
    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");
    webSocket.sendTXT(num, json);
    Serial.println("Get status info: " + json);
    return;
  }

  // ~ ==> Get WS2812 modes.
  if (payload[0] == '~') {
    String json = listModesJSON();

    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");
    webSocket.sendTXT(num, json);
    Serial.println("Get WS2812 modes.");
    Serial.println(json);
    return;
  }

  // / ==> Set WS2812 mode.
  if (payload[0] == '/') {
    handleSetWS2812FXMode(payload);
    Serial.print("WS: ");
    webSocket.sendTXT(num, "OK");
    Serial.printf("Set WS2812 mode: [%s]\n", payload);
    return;
  }

  // . ==> (CUSTOM) Set FFT value, to display in music mode
  if (payload[0] == '.') {
    //    int tmpFFTValue = (int) strtol((const char *) &payload[1], NULL, 10);
    //    fftValue = constrain(tmpFFTValue, 0, 255);
    return;
  }
  webSocket.sendTXT(num, "COMMAND NOT FOUND");
  Serial.printf("WS: Command not found: %s\n", payload[0]);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("WS: [%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED: {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("WS: [%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        // send message to client
        webSocket.sendTXT(num, "Connected");
      }
      break;
    case WStype_TEXT:
      Serial.printf("WS: [%u] get Text: %s\n", num, payload);
      checkpayload(payload, num);
      break;
  }
}
