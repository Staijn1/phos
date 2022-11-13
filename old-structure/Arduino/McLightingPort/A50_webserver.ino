WebServer server(80);
unsigned long lastTimeConnected = 0L;

void runWebserver() {
  if (WiFi.status() != WL_CONNECTED && isConfigured) {
    unsigned long now = millis();
    if (now - lastTimeConnected >= NETWORK_TIMEOUT) {
      ESP.restart();
    }
  } else {
    lastTimeConnected = millis();
  }

  server.handleClient();
}

void setupWebserver() {
  server.enableCORS();

  server.on("/", []() {
    server.send(200, "text/html", index_html);
  });

  server.on("/configure", []() {
    saveConfig();
  });

  if (isConfigured && !isConfiguredAsClient()) {
    Serial.println("[WEBSERVER SETUP] Creating additional routes");
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

    server.on("/reset", []() {
      resetConfig();
    });

    server.on("/set_mode", []() {
      handleSetMode();
      getStatusJSON();
    });
  } else {
    Serial.println("[WEBSERVER SETUP] This device is not configured yet or configured as client. Skipping creating additional routes");
  }

  server.begin();
}

/**
   Utility functions
*/
void getStatusJSON() {
  server.send ( 200, "application/json", listStatusJSON() );
}

void getModesJSON() {
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
