//
// Created by stein on 6-12-2022.
//

#include "Ledstrip.h"
#include "utils/Logger.h"
#include "../../../.pio/libdeps/esp32dev/Adafruit NeoPixel/Adafruit_NeoPixel.h"

void Ledstrip::setup() {
    Logger::log("Ledstrip", "Setting up ledstrip");
    LedstripConfiguration config = configurationManager.getConfig();
    int test = 60;
    int test2=26;
    strip = new WS2812FX(test, test2, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) + 0x0000);
    strip->init();


    strip->setMode(FX_MODE_STATIC);
    strip->setColor(0x000000);
    strip->start();
}

void Ledstrip::run() {
    strip->service();
}
