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

    int brightness = 196;
    int speed = 1000;
public:
    void setup();

    void run();

    void setMode(int mode);

    void increaseBrightness();

    void decreaseBrightness();
};


#endif //ANGULON_LEDSTRIP_LEDSTRIP_H
