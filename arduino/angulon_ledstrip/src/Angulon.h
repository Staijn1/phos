//
// Created by stein on 2-12-2022.
//

#ifndef ANGULON_LEDSTRIP_ANGULON_H
#define ANGULON_LEDSTRIP_ANGULON_H


#include "utils/logger/Logger.h"
#include "connections/configuration/ConfigurationManager.h"
#include "connections/websocket/Websocket.h"

class Angulon {
private:
    ConfigurationManager configuration;
    Websocket websocket;
public:
    void setup();

    void loop();

    static Ledstrip *ledstrip;
};


#endif //ANGULON_LEDSTRIP_ANGULON_H
