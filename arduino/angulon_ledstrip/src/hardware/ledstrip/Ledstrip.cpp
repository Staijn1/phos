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
    Ledstrip::strip->setCustomMode(F("Static"), Ledstrip::staticMode);
    // Todo make State set initial ledstrip state
    Ledstrip::strip->setMode(FX_MODE_CUSTOM_2);
    Ledstrip::strip->setSpeed(1000);
    Ledstrip::strip->setBrightness(brightness);
    Ledstrip::strip->setColor(0x000000);

    Ledstrip::strip->setSegment(0, 0, this->ledcount - 1, FX_MODE_CUSTOM_2, Ledstrip::strip->getColor(), 0, NO_OPTIONS);

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

void Ledstrip::setMode(int mode, boolean force) {
    // Do not set the mode if the new mode is the same as the current mode except if it is a custom mode
    // By setting the same mode the animation restarts which looks strange when setting brightness/speed or color

    if (mode == FX_MODE_CUSTOM   || mode == FX_MODE_CUSTOM_1 || mode == FX_MODE_CUSTOM_2) {
        Logger::log("Ledstrip", "Received a custom mode, setting segment");
        Ledstrip::strip->setSegment(0, 0, this->ledcount - 1, mode, Ledstrip::strip->getSegment()->colors, 0, NO_OPTIONS);
    } else {
        const int currentMode = Ledstrip::strip->getMode();
        if(currentMode == mode && force == false) return;
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

/**
 * This function calculates the new brightness value by reducing the primary color brightness linearly based on FFT values.
 * 
 * The primary color is represented as a 32-bit integer in the format 0xRRGGBB, where RR, GG, and BB are the red, green, and blue components, respectively.
 * The function extracts the red, green, and blue components from the primary color using bitwise operations.
 * It then calculates a brightness factor by mapping the FFT value from 0-255 to a range of 0-1.
 * The red, green, and blue components are multiplied by the brightness factor to reduce their brightness linearly based on the FFT value.
 * The new color is constructed by combining the modified red, green, and blue components using bitwise operations.
 * The new color is set for each LED in the strip using the setPixelColor function.
 */
uint16_t Ledstrip::vuMeterBrightness() {
    const WS2812FX::Segment *seg = strip->getSegment();
    const uint32_t primaryColor = seg->colors[0];
    uint8_t r = (primaryColor >> 16) & 0xFF;
    uint8_t g = (primaryColor >> 8) & 0xFF;
    uint8_t b = primaryColor & 0xFF;

    const double brightnessFactor = getFFTValue() / 255.0;
    r = static_cast<uint8_t>(r * brightnessFactor);
    g = static_cast<uint8_t>(g * brightnessFactor);
    b = static_cast<uint8_t>(b * brightnessFactor);

    const uint32_t newColor = (r << 16) | (g << 8) | b;

    for (int i = 0; i < ConfigurationManager::systemConfiguration.ledcount; i++) {
        strip->setPixelColor(i, newColor);
    }

    return seg->speed;
}

uint16_t Ledstrip::staticMode() {
    WS2812FX::Segment *seg = Ledstrip::strip->getSegment();
    for (int i = 0; i < ConfigurationManager::systemConfiguration.ledcount; i++) {
        Ledstrip::strip->setPixelColor(i, seg->colors[0]);
    }
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

