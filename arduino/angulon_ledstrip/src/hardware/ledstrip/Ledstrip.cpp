//
// Created by stein on 6-12-2022.
//

#include "Ledstrip.h"
#include "utils/logger/Logger.h"
#include "../../../.pio/libdeps/esp32dev/Adafruit NeoPixel/Adafruit_NeoPixel.h"

void Ledstrip::setup() {
    Logger::log("Ledstrip", "Setting up ledstrip");
    SystemConfiguration config = configurationManager.getConfig();
    strip = new WS2812FX(config.ledcount, config.ledpin, NEO_GRB + NEO_KHZ800);
    strip->init();


    strip->setMode(FX_MODE_STATIC);
    strip->setSpeed(speed);
    strip->setBrightness(brightness);
    strip->setColor(0xFF0000);
    strip->start();
}

void Ledstrip::run() {
    strip->service();
}

void Ledstrip::setColors(int segment, uint32_t *colors) {
    strip->setColors(segment, colors);
    Logger::log("Ledstrip", "Setting colors");
}

uint8_t Ledstrip::getMode() {
    return strip->getMode();
}

String Ledstrip::getModeName(uint8_t mode) {
    return strip->getModeName(mode);
}

int Ledstrip::getSpeed() {
    return strip->getSpeed();
}

int Ledstrip::getBrightness() {
    return brightness;
}

String * Ledstrip::getColorsHexString() {
    return this->colorsHexString;
}

