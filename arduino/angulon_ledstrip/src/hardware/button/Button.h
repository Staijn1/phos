//
// Created by stein on 2-12-2022.
//

#ifndef ANGULON_LEDSTRIP_BUTTON_H
#define ANGULON_LEDSTRIP_BUTTON_H


class Button {
public:
    explicit Button(int pin);

    bool isPressed();

private:
    int pin;
};


#endif //ANGULON_LEDSTRIP_BUTTON_H
