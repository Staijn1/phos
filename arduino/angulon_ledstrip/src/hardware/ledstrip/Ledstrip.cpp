//
// Created by stein on 6-12-2022.
//

#include "Ledstrip.h"
#include "utils/Logger.h"
#include "../../../.pio/libdeps/esp32dev/Adafruit NeoPixel/Adafruit_NeoPixel.h"

void Ledstrip::setup() {
    Logger::log("Ledstrip", "Setting up ledstrip");
    LedstripConfiguration config = configurationManager.getConfig();
    strip = new WS2812FX(config.ledcount, config.ledpin, NEO_GRB + NEO_KHZ800);
    strip->init();


    strip->setMode(FX_MODE_STATIC);
    strip->setSpeed(speed);
    strip->setBrightness(brightness);
    strip->setColor(0x000000);
    strip->start();
}

void Ledstrip::run() {
    strip->service();
}

void Ledstrip::setMode(int mode) {
    strip->setMode(mode);
}

void Ledstrip::increaseBrightness() {
    brightness = constrain(brightness * 1.1, 0, 255);
    strip->setBrightness(brightness);
}

void Ledstrip::decreaseBrightness() {
    brightness = constrain(brightness * 0.9, 0, 255);
    strip->setBrightness(brightness);
}
