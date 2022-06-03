WebSocketsServer webSocket = WebSocketsServer(81);

void setupWebsocketServer() {
  webSocket.begin();
  webSocket.onEvent(webSocketServerEvent);
}

void runWebsocketServer() {
  webSocket.loop();
}

void broadcastToAllClients(uint8_t * payload) {
  if (!isConfiguredAsClient()) {
    Serial.print("[WSS] Broadcasting to all clients: ");
    Serial.println((char*)payload);
    webSocket.broadcastTXT(payload);
  }
}
