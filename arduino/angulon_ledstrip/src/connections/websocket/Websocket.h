//
// Created by stein on 5-12-2022.
//

#ifndef ANGULON_LEDSTRIP_WEBSOCKET_H
#define ANGULON_LEDSTRIP_WEBSOCKET_H


#include "../../../.pio/libdeps/esp32dev/WebSockets/src/SocketIOclient.h"
#include "hardware/led/Led.h"

#define BUILTIN_LED 2

class Websocket {
private:
    SocketIOclient socketIO;
    Led *led = new Led(BUILTIN_LED);

    void webSocketClientEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);

public:

    void setup();

    void run();
};

#endif //ANGULON_LEDSTRIP_WEBSOCKET_H
