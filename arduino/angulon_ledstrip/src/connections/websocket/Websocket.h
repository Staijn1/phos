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

    int speed = 1000;
public:

    void setup();

    void run();

    void handleEvent(uint8_t *payload, size_t length);

    void handleBangEvent();

    void handleQuestionEvent();

    void handleHashEvent();

    void handlePlusEvent();

    void handleSlashEvent();

    void handleDotEvent();

    void handleUnknownEvent();
};

#endif //ANGULON_LEDSTRIP_WEBSOCKET_H
