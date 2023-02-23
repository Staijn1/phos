//
// Created by stein on 23/02/2023.
//

#include "State.h"
#include "ArduinoJson.h"
#include "Angulon.h"


String State::getStateJSON() {
    uint8_t currentMode = Angulon::ledstrip->getMode();

    const size_t bufferSize = JSON_ARRAY_SIZE(3) + JSON_OBJECT_SIZE(6) + 500;
    DynamicJsonDocument jsonBuffer(bufferSize);
    JsonObject root = jsonBuffer.to<JsonObject>();
    root["mode"] = currentMode;
    root["modeName"] = Angulon::ledstrip->getModeName(currentMode);
    root["speed"] = Angulon::ledstrip->getSpeed();
    root["brightness"] = Angulon::ledstrip->getBrightness();

    JsonArray color = root.createNestedArray("color");
    const auto &colors = Angulon::ledstrip->getColorsHexString();
    color.add(colors[0]);
    color.add(colors[1]);
    color.add(colors[2]);

    String json;
    serializeJson(root, json);
    jsonBuffer.clear();
    return json;
}

void State::setState(const JsonObject object) {
    Logger::log("State", "Updating state");

    int mode = object["mode"]; // 0
    int speed = object["speed"]; // 1000
    int brightness = object["brightness"]; // 196

    JsonArray colors = object["colors"];
    const char *color_0 = colors[0]; // "#ff0000"
    const char *color_1 = colors[1]; // "#00ff00"
    const char *color_2 = colors[2]; // "#0000ff"

    Angulon::ledstrip->setMode(mode);
    Angulon::ledstrip->setBrightness(brightness);
    Angulon::ledstrip->setSpeed(speed);
    Angulon::ledstrip->setColors(0, color_0, color_1, color_2);
}
