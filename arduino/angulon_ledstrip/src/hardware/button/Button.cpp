//
// Created by stein on 2-12-2022.
//

#include "Button.h"
#include "Arduino.h"

Button::Button(int pin) {
    this->pin = pin;
    pinMode(pin, INPUT);
}

bool Button::isPressed() {
    return digitalRead(pin) == 0;
}
