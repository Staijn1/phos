#include <WiFi.h>
#include <WebServer.h>
#include <Ticker.h>
#include <definitions.h>

Ticker ticker;

WebServer server(80);

void setupWebserver() {
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // This part of code will try create static IP address
  if (!WiFi.config(local_ip, gateway, subnet)) {
    Serial.println("STA Failed to configure");
  }
  Serial.println();
  WiFi.begin(ssid, password);
  ticker.attach_ms(250, connectingLed);
  while (WiFi.status() != WL_CONNECTED) {}
  ticker.detach();

  // Print local IP address and start web server
  Serial.println();
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  setupRouting();
}

void setupRouting() {
  server.on("/mode", GETMode);

  // start server
  server.begin();
}

void runWebserver() {
  server.loop();
}

void connectingLed() {
  digitalWrite(BUILTIN_LED, !(digitalRead(BUILTIN_LED)));  //Invert Current State of LED
  Serial.print(".");
}

void GETMode() {
  server.send(200, "text/plain", "Hello world");
}
