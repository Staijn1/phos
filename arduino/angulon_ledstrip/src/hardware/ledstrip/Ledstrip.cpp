//
// Created by stein on 6-12-2022.
//

#include "Ledstrip.h"
#include "utils/logger/Logger.h"
#include "../../../.pio/libdeps/esp32dev/Adafruit NeoPixel/Adafruit_NeoPixel.h"

WS2812FX* Ledstrip::strip;
int Ledstrip::FFTValue =0;

void Ledstrip::setup() {
    Logger::log("Ledstrip", "Setting up ledstrip");
    SystemConfiguration config = configurationManager.getConfig();
    this->ledcount = config.ledcount;
    strip = new WS2812FX(config.ledcount, config.ledpin, NEO_GRB + NEO_KHZ800);

    Logger::log("Ledstrip", "Registering VUMeter effect");
    strip->setCustomMode(F("VuMeter"), Ledstrip::vuMeter);
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
    Ledstrip::strip->setMode(mode);
    if (mode == FX_MODE_CUSTOM) {
        strip->setSegment(0, 0, this->ledcount - 1, FX_MODE_CUSTOM, strip->getColor(), 0, NO_OPTIONS);
    }
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

uint16_t Ledstrip::vuMeter(void) {
    WS2812FX::Segment *seg = Ledstrip::strip->getSegment();
    int ledCount = ConfigurationManager::systemConfiguration.ledcount;
    const int amountOfLedsToShow = map(Ledstrip::getFFTValue(), 0, 255, 0, ledCount);

    for (int index = 0; index < ledCount; index++) {
        if (index <= amountOfLedsToShow) {
            strip->setPixelColor(index, seg->colors[0]);
        } else {
            strip->setPixelColor(index, seg->colors[1]);
        }
    }

    return seg->speed;
}
