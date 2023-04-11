//
// Created by stein on 6-12-2022.
//

#include "Ledstrip.h"
#include "utils/logger/Logger.h"
#include "../../../.pio/libdeps/esp32dev/Adafruit NeoPixel/Adafruit_NeoPixel.h"

WS2812FX *Ledstrip::strip;
int Ledstrip::FFTValue = 0;

void Ledstrip::setup() {
    Logger::log("Ledstrip", "Setting up ledstrip");
    SystemConfiguration config = configurationManager.getConfig();
    this->ledcount = ConfigurationManager::systemConfiguration.ledcount;
    Ledstrip::strip = new WS2812FX(this->ledcount, config.ledpin, NEO_GRB + NEO_KHZ800);

    Logger::log("Ledstrip", "Registering VUMeter effect");
    Ledstrip::strip->init();
    Ledstrip::strip->setCustomMode(F("VuMeter"), Ledstrip::vuMeter);
    Ledstrip::strip->setCustomMode(F("VuMeter Brightness"), Ledstrip::vuMeterBrightness);
    // Todo make State set initial ledstrip state
    Ledstrip::strip->setMode(FX_MODE_STATIC);
    Ledstrip::strip->setSpeed(1000);
    Ledstrip::strip->setBrightness(brightness);
    Ledstrip::strip->setColor(0x000000);

    Ledstrip::strip->setSegment(0, 0, this->ledcount - 1, FX_MODE_CUSTOM, Ledstrip::strip->getColor(), 0, NO_OPTIONS);

    Ledstrip::strip->start();
}

void Ledstrip::run() {
    Ledstrip::strip->service();
}

void Ledstrip::setColors(int segment, uint32_t *colors) {
    Ledstrip::strip->setColors(segment, colors);
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
    return Ledstrip::strip->getMode();
}

void Ledstrip::setMode(int mode) {
    if (mode == FX_MODE_CUSTOM   || mode == FX_MODE_CUSTOM_1) {
        Logger::log("Ledstrip", "Received a custom mode, setting segment");
        Ledstrip::strip->setSegment(0, 0, this->ledcount - 1, mode, Ledstrip::strip->getColor(), 0, NO_OPTIONS);
    } else {
        Ledstrip::strip->setMode(mode);
    }
    Logger::log("Ledstrip", "Set mode to: " + String(mode));
}


String Ledstrip::getModeName(uint8_t mode) {
    return Ledstrip::strip->getModeName(mode);
}


int Ledstrip::getSpeed() {
    return Ledstrip::strip->getSpeed();
}

void Ledstrip::setSpeed(int speed) {
    Ledstrip::strip->setSpeed(speed);
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
    char *endptr;
    uint32_t intValue = strtol(color + 1, &endptr, 16);
    return intValue;
}

void Ledstrip::setFFTValue(int value) {
    Ledstrip::FFTValue = value;
}

int Ledstrip::getFFTValue() {
    return Ledstrip::FFTValue;
}


uint16_t Ledstrip::vuMeter() {
    WS2812FX::Segment *seg = Ledstrip::strip->getSegment();
    const int ledcount = ConfigurationManager::systemConfiguration.ledcount;
    const int amountOfLedsToShow = map(Ledstrip::getFFTValue(), 0, 255, 0, ledcount);

    for (int index = 0; index < ledcount; index++) {
        if (index <= amountOfLedsToShow) {
            Ledstrip::strip->setPixelColor(index, seg->colors[0]);
        } else {
            Ledstrip::strip->setPixelColor(index, seg->colors[1]);
        }
    }

    return seg->speed;
}

uint16_t Ledstrip::vuMeterBrightness() {
    WS2812FX::Segment *seg = Ledstrip::strip->getSegment();
    const int ledcount = ConfigurationManager::systemConfiguration.ledcount;
    for (int index = 0; index < ledcount; index++) {
        Ledstrip::strip->setPixelColor(index, seg->colors[0]);
    }
    Ledstrip::strip->setBrightness(Ledstrip::getFFTValue());
    return seg->speed;
}

uint8_t Ledstrip::getModeCount() {
    return Ledstrip::strip->getModeCount();
}

void
Ledstrip::setSegment(uint8_t segment, uint16_t start, uint16_t stop, uint8_t mode, uint16_t speed, const char *color_0,
                     const char *color_1, const char *color_2) {
    this->colorsHexString[0] = color_0;
    this->colorsHexString[1] = color_1;
    this->colorsHexString[2] = color_2;
    uint32_t convertedColors[MAX_NUM_COLORS] = {
            this->hexStringToInt(color_0),
            this->hexStringToInt(color_1),
            this->hexStringToInt(color_2)};
    Ledstrip::strip->setSegment(segment, start, stop, mode, convertedColors, speed);
}
