//
// Created by stein on 6-12-2022.
//

#ifndef ANGULON_LEDSTRIP_LED_H
#define ANGULON_LEDSTRIP_LED_H


class Led {
private:
    int pin;
public:
    explicit Led(int pin);

    void turnOn();

    void turnOff();

    void toggle();
};


#endif //ANGULON_LEDSTRIP_LED_H
