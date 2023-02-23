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


    // Todo make State set initial ledstrip state
    strip->setMode(FX_MODE_STATIC);
    strip->setSpeed(1000);
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

void Ledstrip::setColors(int segment, const char *color_0, const char *color_1, const char *color_2) {
    this->colorsHexString[0] = color_0;
    this->colorsHexString[1] = color_1;
    this->colorsHexString[2] = color_2;
    uint32_t convertedColors[MAX_NUM_COLORS] = {
            this->hexStringToInt(color_0),
            this->hexStringToInt(color_1),
            this->hexStringToInt(color_2)};
    this->setColors(segment, convertedColors);
}

uint8_t Ledstrip::getMode() {
    return strip->getMode();
}

void Ledstrip::setMode(int mode) {
    this->strip->setMode(mode);
    Logger::log("Ledstrip", "Set mode to: " + String(mode));
}


String Ledstrip::getModeName(uint8_t mode) {
    return strip->getModeName(mode);
}


int Ledstrip::getSpeed() {
    return strip->getSpeed();
}

void Ledstrip::setSpeed(int speed) {
    strip->setSpeed(speed);
    Logger::log("Ledstrip", "Set speed to: " + String(speed));
}


int Ledstrip::getBrightness() {
    return brightness;
}

void Ledstrip::setBrightness(int brightness) {
    this->strip->setBrightness(brightness);
    this->brightness = brightness;
    Logger::log("Ledstrip", "Set brightness to: " + String(brightness));
}

String *Ledstrip::getColorsHexString() {
    return this->colorsHexString;
}

uint32_t Ledstrip::hexStringToInt(const char *color) {
    std::string hex_str = color;
    // Remove the prefix from the hexadecimal string
    std::string hex_str_without_prefix = hex_str.substr(1);
    // Convert the hexadecimal string to a uint32_t value
    return strtoul(hex_str_without_prefix.c_str(), nullptr, 16);
}


