//
// Created by stein on 2-12-2022.
//

#ifndef ANGULON_LEDSTRIP_ANGULON_H
#define ANGULON_LEDSTRIP_ANGULON_H


#include <hardware/led/Led.h>
#include "connections/configuration/ConfigurationManager.h"
#include "connections/websocket/Websocket.h"
#include "connections/OTA/OTA.h"

class Angulon {
private:
    ConfigurationManager configuration;
    Websocket websocket;
    OTA ota;
public:
    static Led *led;

    void setup();

    void loop();

    static Ledstrip *ledstrip;
};


#endif //ANGULON_LEDSTRIP_ANGULON_H
