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
    WS2812FX *strip;
    String colorsHexString[3] = {"#ff0000", "#00ff00", "#0000ff"};


    int brightness = 196;
    int speed = 1000;
public:
    void setup();

    void run();

    void setColors(int segment, uint32_t colors[3]);

    String * getColorsHexString();

    uint8_t getMode();

    String getModeName(uint8_t mode);

    int getBrightness();

    int getSpeed();
};


#endif //ANGULON_LEDSTRIP_LEDSTRIP_H
