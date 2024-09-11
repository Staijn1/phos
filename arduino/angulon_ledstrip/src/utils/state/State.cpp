#include "State.h"
#include "ArduinoJson.h"
#include "Angulon.h"

void State::setState(const JsonObject object) {
    Logger::log("State", "Updating state");

    boolean forceState = object["force"];

    int mode = object["mode"]; // 0
    int speed = object["speed"]; // 1000
    int brightness = object["brightness"]; // 196

    JsonArray colors = object["colors"];
    const char *color_0 = colors[0]; // "#ff0000"
    const char *color_1 = colors[1]; // "#00ff00"
    const char *color_2 = colors[2]; // "#0000ff"

    Angulon::ledstrip->setBrightness(brightness);
    Angulon::ledstrip->setSpeed(speed);
    Angulon::ledstrip->setColors(0, color_0, color_1, color_2);
    Angulon::ledstrip->setMode(FX_MODE_CUSTOM_2, forceState);
}

void State::setStateSegments(const JsonObject object) {
    Logger::log("State", "Updating state with segments");

    String brightness = object["brightness"]; // new brightness for the ledstrip
    Serial.println(brightness);
//    Angulon::ledstrip->setBrightness(brightness);

    JsonArray segments = object["segments"];
    for (JsonVariant segment: segments) {
        int segmentNumber = segment["segment"];
        int start = segment["start"];
        int stop = segment["stop"];
        int mode = segment["mode"];
        int speed = segment["speed"];

        JsonArray colors = segment["colors"];
        const char *color_0 = colors[0]; // "#ff0000"
        const char *color_1 = colors[1]; // "#00ff00"
        const char *color_2 = colors[2]; // "#0000ff"
        Angulon::ledstrip->setSegment(segmentNumber, start, stop, mode, speed, color_0, color_1, color_2);
    }
}

String State::getModesJSON() {
    const size_t bufferSize = JSON_ARRAY_SIZE(Angulon::ledstrip->getModeCount() + 1) +
                              Angulon::ledstrip->getModeCount() * JSON_OBJECT_SIZE(2) + 1000;
    DynamicJsonDocument jsonBuffer(bufferSize);
    JsonArray json = jsonBuffer.to<JsonArray>();
    for (uint8_t i = 0; i < Angulon::ledstrip->getModeCount(); i++) {
        JsonObject object = json.createNestedObject();
        object["mode"] = i;
        object["name"] = Angulon::ledstrip->getModeName(i);
    }
    JsonObject object = json.createNestedObject();

    String json_str;
    serializeJson(json, json_str);
    return json_str;
}
