//
// Created by stein on 25/02/2023.
//

#include "OTA.h"
#include "utils/logger/Logger.h"
#include "Angulon.h"
#include <ArduinoOTA.h>

void OTA::setup() {
    ArduinoOTA
            .onStart([]() {
                String type;
                if (ArduinoOTA.getCommand() == U_FLASH)
                    type = "sketch";
                else // U_SPIFFS
                    type = "filesystem";

                // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
                Logger::log("OTA", "Received new files, starting update. Update type: " + type);
            })
            .onEnd([]() {
                Logger::log("OTA", "Finished flash");
                Angulon::led->turnOff();
            })
            .onProgress([this](unsigned int progress, unsigned int total) {
                unsigned int percentage = (progress / (total / 100));
                Logger::log("OTA", "Progress: " + String(percentage));
                 // Blink interval in milliseconds
                static unsigned long previousMillis = 0;
                if (millis() - previousMillis >= this->blinkInterval) {
                    previousMillis = millis();
                    Angulon::led->toggle();
                }
            })
            .onError([](ota_error_t error) {
                Serial.printf("Error[%u]: ", error);
                if (error == OTA_AUTH_ERROR) Logger::log("OTA", "Auth Failed");
                else if (error == OTA_BEGIN_ERROR)Logger::log("OTA", "Begin Failed");
                else if (error == OTA_CONNECT_ERROR) Logger::log("OTA", "Connect Failed");
                else if (error == OTA_RECEIVE_ERROR) Logger::log("OTA", "Receive Failed");
                else if (error == OTA_END_ERROR) Logger::log("OTA", "End Failed");
            });

    ArduinoOTA.begin();
    Logger::log("OTA", "OTA setup finished");
}

void OTA::run() {
    ArduinoOTA.handle();
}
