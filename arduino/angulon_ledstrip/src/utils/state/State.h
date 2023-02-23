//
// Created by stein on 23/02/2023.
//

#ifndef ANGULON_LEDSTRIP_STATE_H
#define ANGULON_LEDSTRIP_STATE_H

#include "Arduino.h"
#include "ArduinoJson.h"

class State {

public:
    static String getStateJSON();

    static void setState(DynamicJsonDocument *doc);
};


#endif //ANGULON_LEDSTRIP_STATE_H
