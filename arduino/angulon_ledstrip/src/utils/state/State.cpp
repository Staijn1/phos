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

    /*JsonArray color = root.createNestedArray("color");
    color.add(main_color.red);
    color.add(main_color.green);
    color.add(main_color.blue);*/

    String json;
    serializeJson(root, json);

    return json;
}