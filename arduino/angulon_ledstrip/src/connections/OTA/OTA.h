//
// Created by stein on 25/02/2023.
//

#ifndef ANGULON_LEDSTRIP_OTA_H
#define ANGULON_LEDSTRIP_OTA_H


#include "connections/configuration/ConfigurationManager.h"

class OTA {
private:
    const int blinkInterval = 30;
public:
    void setup();
    void run();

};


#endif //ANGULON_LEDSTRIP_OTA_H
