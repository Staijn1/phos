void handleSetMainColor(uint8_t * mypayload) {
  // decode rgb data
  uint32_t rgb = (uint32_t) strtol((const char *) &mypayload[1], NULL, 16);
  main_color.red = ((rgb >> 16) & 0xFF);
  main_color.green = ((rgb >> 8) & 0xFF);
  main_color.blue = ((rgb >> 0) & 0xFF);
  strip->setColor(main_color.red, main_color.green, main_color.blue);
}

void handleSetWS2812FXMode(uint8_t * mypayload) {
  uint8_t ws2812fx_mode_tmp = (uint8_t) strtol((const char *) &mypayload[1], NULL, 10);
  ws2812fx_mode = constrain(ws2812fx_mode_tmp, 0, strip->getModeCount() - 1);

  updateMode();
}

void webSocketServerEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {
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
      checkpayloadserver(payload, num);
      broadcastToAllClients(payload);
      break;
  }
}
