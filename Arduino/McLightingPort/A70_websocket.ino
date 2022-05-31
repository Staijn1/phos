WebSocketsServer webSocket = WebSocketsServer(81);

void setupWebsocketServer() {
  webSocket.begin();
  webSocket.onEvent(webSocketServerEvent);
}

void runWebsocketServer() {
  webSocket.loop();
}
