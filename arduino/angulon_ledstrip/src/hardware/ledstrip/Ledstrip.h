//
// Created by stein on 6-12-2022.
//

#ifndef ANGULON_LEDSTRIP_LEDSTRIP_H
#define ANGULON_LEDSTRIP_LEDSTRIP_H


#include "../../../.pio/libdeps/esp32dev/WS2812FX/src/WS2812FX.h"
#include "connections/configuration/ConfigurationManager.h"

class Ledstrip {
private:
    ConfigurationManager configurationManager;
    static WS2812FX *strip;
    String colorsHexString[3] = {"#ff0000", "#00ff00", "#0000ff"};

    int brightness = 200;
    static int FFTValue;

    uint32_t hexStringToInt(const char *color);

    uint16_t ledcount;
public:
    void setup();

    void run();

    void setColors(int segment, uint32_t colors[3]);

    void setColors(int segment, const char *color_0, const char *color_1, const char *color_2);

    String *getColorsHexString();

    uint8_t getMode();

    String getModeName(uint8_t mode);

    int getBrightness();

    int getSpeed();

    void setMode(int mode);

    void setSpeed(int speed);

    void setBrightness(int brightness);

    void setFFTValue(int value);

    static int getFFTValue();


    uint8_t getModeCount();

    // Custom effects
    static uint16_t vuMeter();

    static uint16_t vuMeterBrightness();

    void setSegment(uint8_t segment, uint16_t start, uint16_t stop, uint8_t mode, uint16_t speed, const char *color_0, const char *color_1, const char *color_2);
};


#endif //ANGULON_LEDSTRIP_LEDSTRIP_H
