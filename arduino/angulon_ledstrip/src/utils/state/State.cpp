//
// Created by stein on 23/02/2023.
//

#include "State.h"
#include "ArduinoJson.h"
#include "Angulon.h"

/// Serialize an array
/// The first element represents the event that has to be fired on the server
/// The second element contains the state object
/// \return
String State::getStateJSON() {
    uint8_t currentMode = Angulon::ledstrip->getMode();
    const auto &colors = Angulon::ledstrip->getColorsHexString();

    StaticJsonDocument<192> doc;

    doc.add("submitState");

    JsonObject doc_1 = doc.createNestedObject();
    doc_1["mode"] = 0;
    doc_1["speed"] = 1000;
    doc_1["brightness"] = 196;

    JsonArray doc_1_color = doc_1.createNestedArray("colors");
    doc_1_color.add(colors[0]);
    doc_1_color.add(colors[1]);
    doc_1_color.add(colors[2]);

    String json;
    serializeJson(doc, json);
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

