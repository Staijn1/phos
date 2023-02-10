//
// Created by stein on 6-12-2022.
//

#include <esp32-hal-gpio.h>
#include "Led.h"

Led::Led(int pin) {
    this->pin = pin;
    pinMode(pin, OUTPUT);

}

void Led::turnOn() {
    digitalWrite(pin, HIGH);
}

void Led::turnOff() {
    digitalWrite(pin, LOW);
}
