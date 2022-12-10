//
// Created by stein on 6-12-2022.
//

#ifndef ANGULON_LEDSTRIP_LED_H
#define ANGULON_LEDSTRIP_LED_H


class Led {
public:
    explicit Led(int pin);

    void turnOn();

    void turnOff();

private:
    int pin;
};


#endif //ANGULON_LEDSTRIP_LED_H
