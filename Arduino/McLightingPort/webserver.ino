WebServer server(80);

void runWebserver() {
  server.handleClient();
}

void setupWebserver() {
  ticker.attach(0.5, tick);
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  Serial.print("Mac adress: ");
  Serial.println(WiFi.macAddress());
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());


  server.on("/", []() {
    server.send(200, "text/plain", "Up and running!");
  });

  server.on("/status", []() {
    getStatusJSON();
  });

  server.on("/restart", []() {
    ESP.restart();
  });
  server.on("/set_brightness", []() {
    handleSetBrightness();
    getStatusJSON();
  });

  server.on("/set_speed", []() {
    handleSetSpeed();
    getStatusJSON();
  });

  server.on("/get_modes", []() {
    getModesJSON();
  });

  server.on("/set_mode", []() {
    handleSetMode();
    getStatusJSON();
  });

  ticker.detach();

  //keep LED on
  digitalWrite(BUILTIN_LED, HIGH);
  server.begin();
}

/**
   Utility functions
*/
void getStatusJSON() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send ( 200, "application/json", listStatusJSON() );
}

void getModesJSON() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send ( 200, "application/json", listModesJSON() );
}

String listStatusJSON() {
  uint8_t tmp_mode = strip->getMode();

  const size_t bufferSize = JSON_ARRAY_SIZE(3) + JSON_OBJECT_SIZE(6) + 500;
  DynamicJsonDocument jsonBuffer(bufferSize);
  JsonObject root = jsonBuffer.to<JsonObject>();
  root["mode"] = tmp_mode;
  root["modeName"] = strip->getModeName(tmp_mode);
  root["speed"] = ws2812fx_speed;
  root["brightness"] = ws2812fx_brightness;
  JsonArray color = root.createNestedArray("color");
  color.add(main_color.red);
  color.add(main_color.green);
  color.add(main_color.blue);

  String json;
  serializeJson(root, json);

  return json;
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
