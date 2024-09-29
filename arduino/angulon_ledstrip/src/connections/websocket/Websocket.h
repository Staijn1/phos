#ifndef ANGULON_LEDSTRIP_WEBSOCKET_H
#define ANGULON_LEDSTRIP_WEBSOCKET_H

#include "../../../.pio/libdeps/esp32dev/WebSockets/src/SocketIOclient.h"
#include "hardware/ledstrip/Ledstrip.h"
#include <ArduinoJson.h>

#define BUILTIN_LED 2

class Websocket {
private:
    SocketIOclient socketIO;
    void webSocketClientEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);

public:
    void setup(SystemConfiguration configuration);
    void run();
    void handleEvent(uint8_t *payload, size_t length);
    void handleBangEvent(uint8_t *payload, const JsonDocument &doc);
    void handleHashEvent(const JsonArray colors);
    void handleDotEvent(uint8_t *payload, const JsonDocument &_doc);
    void handleIndividualLedControlEvent(uint8_t *payload, const JsonDocument &_doc);
    void handleUnknownEvent(uint8_t *payload, const JsonDocument &_doc);
};

#endif //ANGULON_LEDSTRIP_WEBSOCKET_H
