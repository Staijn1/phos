#include <esp32-hal-gpio.h>
#include "Led.h"

Led::Led(const int pin) {
    this->pin = pin;
    pinMode(pin, OUTPUT);
}

void Led::turnOn() {
    digitalWrite(pin, HIGH);
}

void Led::turnOff() {
    digitalWrite(pin, LOW);
}

void Led::toggle(){
    digitalWrite(pin, !digitalRead(pin));
}
