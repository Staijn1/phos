//
// Created by stein on 5-12-2022.
//

#ifndef ANGULON_LEDSTRIP_WEBSOCKET_H
#define ANGULON_LEDSTRIP_WEBSOCKET_H


#include "../../../.pio/libdeps/esp32dev/WebSockets/src/SocketIOclient.h"
#include "hardware/led/Led.h"
#include "hardware/ledstrip/Ledstrip.h"
#include <ArduinoJson.h>

#define BUILTIN_LED 2

class Websocket {
private:
    SocketIOclient socketIO;
    Led *led = new Led(BUILTIN_LED);
    Ledstrip *ledstrip;

    void webSocketClientEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);

public:

    void setup();

    void run();

    void handleEvent(uint8_t *payload, size_t length);

    void handleBangEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleQuestionEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleHashEvent(uint8_t *payload, const JsonDocument &_doc);

    void handlePlusEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleMinusEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleSlashEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleDotEvent(uint8_t *payload, const JsonDocument &_doc);

    void handleUnknownEvent(uint8_t *payload, const JsonDocument &_doc);
};

#endif //ANGULON_LEDSTRIP_WEBSOCKET_H
