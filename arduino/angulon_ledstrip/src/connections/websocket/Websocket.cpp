//
// Created by stein on 5-12-2022.
//

#include "Websocket.h"
#include "utils/Logger.h"

void Websocket::setup() {
    Logger::log("Websocket", "Setting up websocket connection");

    socketIO.begin("192.168.2.4", 3333, "/socket.io/?EIO=4");
    socketIO.onEvent([&](socketIOmessageType_t type, uint8_t *payload, size_t length) {
        this->webSocketClientEvent(type, payload, length);
    });
    socketIO.setReconnectInterval(5000);
}

void Websocket::run() {
    socketIO.loop();
}

void Websocket::webSocketClientEvent(socketIOmessageType_t type, uint8_t *payload, size_t length) {
    switch (type) {
        case sIOtype_DISCONNECT:
            Websocket::led->turnOff();
            Logger::log("Websocket", "Disconnected from server");
            break;
        case sIOtype_CONNECT:
            Websocket::led->turnOn();
            Logger::log("Websocket", "Connected to server");
            break;
        case sIOtype_EVENT: {
            Logger::log("Websocket", "Got an event from the server");
            break;
        }
        case sIOtype_ACK:
            Logger::log("Websocket", "Got an ack from the server");
            break;
        case sIOtype_ERROR:
            Logger::log("Websocket", "Got an error from the server");
            break;
        case sIOtype_BINARY_EVENT:
            Logger::log("Websocket", "Got a binary event from the server");
            break;
        case sIOtype_BINARY_ACK:
            Logger::log("Websocket", "Got a binary ack from the server");
            break;
    }
}
