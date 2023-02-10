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
    strip->setColor(0xFF0000);
    strip->start();
}

void Ledstrip::run() {
    strip->service();
}

void Ledstrip::setMode(int mode) {
    strip->setMode(mode);

    Logger::log("Ledstrip", "Setting mode to: " + String(mode));
}

void Ledstrip::increaseBrightness() {
    brightness = constrain(brightness * 1.1, 0, 255);
    strip->setBrightness(brightness);
    Logger::log("Ledstrip", "Setting brightness to: " + String(brightness));
}

void Ledstrip::decreaseBrightness() {
    brightness = constrain(brightness * 0.9, 0, 255);
    strip->setBrightness(brightness);
    Logger::log("Ledstrip", "Setting brightness to: " + String(brightness));
}

void Ledstrip::increaseSpeedDelay() {
    speed = constrain(speed * 1.1, SPEED_MIN, SPEED_MAX);
    strip->setSpeed(speed);
    Logger::log("Ledstrip", "Setting speed to: " + String(speed));
}

void Ledstrip::decreaseSpeedDelay() {
    speed = constrain(speed * 0.9, SPEED_MIN, SPEED_MAX);
    strip->setSpeed(speed);
    Logger::log("Ledstrip", "Setting speed to: " + String(speed));
}

void Ledstrip::setColors(int i, uint32_t *colors) {
    strip->setColors(i, colors);
    Logger::log("Ledstrip", "Setting colors");
}
