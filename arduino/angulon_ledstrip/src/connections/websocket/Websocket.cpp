//
// Created by stein on 5-12-2022.
//

#include <map>
#include "Websocket.h"
#include "utils/state/State.h"
#include "utils/logger/Logger.h"
#include "Angulon.h"

void Websocket::setup() {
    Logger::log("Websocket", "Setting up websocket connection");
    Angulon::led->turnOff();

    SystemConfiguration configuration = configurationManager->getConfig();
    socketIO.begin(configuration.serverip, configuration.serverport, "/socket.io/?EIO=4");
    socketIO.onEvent([&](socketIOmessageType_t type, uint8_t *payload, size_t length) {
        this->webSocketClientEvent(type, payload, length);
    });
    socketIO.setReconnectInterval(5000);
}

void Websocket::run() {
    socketIO.loop();
}

void Websocket::webSocketClientEvent(socketIOmessageType_t type, uint8_t *payload, size_t length) {
    std::map<socketIOmessageType_t, std::string> typeToStringMap{
            {sIOtype_DISCONNECT,   "sIOtype_DISCONNECT"},
            {sIOtype_CONNECT,      "sIOtype_CONNECT"},
            {sIOtype_EVENT,        "sIOtype_EVENT"},
            {sIOtype_ACK,          "sIOtype_ACK"},
            {sIOtype_ERROR,        "sIOtype_ERROR"},
            {sIOtype_BINARY_EVENT, "sIOtype_BINARY_EVENT"},
            {sIOtype_BINARY_ACK,   "sIOtype_BINARY_ACK"},
    };


    switch (type) {
        case sIOtype_DISCONNECT:
            Angulon::led->turnOff();
            Logger::log("Websocket", "Disconnected from server");
            break;
        case sIOtype_CONNECT: {
            // Join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            Angulon::led->turnOn();
            Logger::log("Websocket", "Connected to server");

            // Send event to update server of current ledstrip state.
            String eventJson = State::getStateJSON();
            socketIO.sendEVENT(eventJson);

            break;
        }
        case sIOtype_EVENT: {
            this->handleEvent(payload, length);
            break;
        }
        case sIOtype_ERROR:
            Logger::log("Websocket", "Got an error from the server");
            break;
        case sIOtype_BINARY_EVENT:
        case sIOtype_ACK:
        case sIOtype_BINARY_ACK:
            // Use the typeToStringMap to convert the type variable to a string
            std::string typeString = typeToStringMap[type];
            // Use the std::string::c_str method to convert the typeString variable to a const char *
            const char *typeStringPtr = typeString.c_str();
            // Use the std::string class to concatenate the "Unhandled event on websocket" string and the typeStringPtr together
            std::string logMessage = "Unhandled event on websocket " + std::string(typeStringPtr);
            // Use the c_str method again to convert the logMessage string to a const char *
            const char *logMessagePtr = logMessage.c_str();
            Logger::log("Websocket", logMessagePtr);
            break;
    }
}

void Websocket::handleEvent(uint8_t *payload, size_t length) {
    StaticJsonDocument<192> doc;

    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
    }

    const char *event = doc[0];// The first element holds the code corresponding to the action (set color, mode, fft etc)
    const JsonObject object = doc[1];
    // Handle the different events
    if (*event == '!') {
        Serial.printf("[Websocket] get event: %s\n", payload);
        State::setState(object);
    } else if (*event == '.') {
        handleDotEvent(payload, doc);
    } else {
        // Handle invalid or unknown event
        handleUnknownEvent(payload, doc);
    }
}

void Websocket::handleDotEvent(uint8_t *payload, const JsonDocument &_doc) {
    Angulon::ledstrip->setFFTValue(constrain(_doc[1], 0, 255));
}

void Websocket::handleUnknownEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle unknown or invalid event here
    Logger::log("Websocket", "Unknown event");
}
