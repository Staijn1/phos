#include <map>
#include "Websocket.h"
#include "utils/state/State.h"
#include "utils/logger/Logger.h"
#include "Angulon.h"
#include <UrlEncode.h>

void Websocket::setup(SystemConfiguration configuration) {
    const String url = "/socket.io/?EIO=4&deviceName=" + urlEncode(configuration.devicename) + "&ledCount=" + urlEncode(String(configuration.ledcount));
    Logger::log("Websocket", "Setting up websocket connection to " + configuration.serverip + ":" + configuration.serverport + url);
    Angulon::led->turnOff();

    socketIO.begin(configuration.serverip, configuration.serverport, url);
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
            const std::string typeString = typeToStringMap[type];
            // Use the std::string::c_str method to convert the typeString variable to a const char *
            const char *typeStringPtr = typeString.c_str();
            // Use the std::string class to concatenate the "Unhandled event on websocket" string and the typeStringPtr together
            const std::string logMessage = "Unhandled event on websocket " + std::string(typeStringPtr);
            // Use the c_str method again to convert the logMessage string to a const char *
            const char *logMessagePtr = logMessage.c_str();
            Logger::log("Websocket", logMessagePtr);
            break;
    }
}

void Websocket::handleEvent(uint8_t *payload, size_t length) {
    StaticJsonDocument<768> doc;

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
        Serial.printf("[Websocket] setting received state: %s\n", payload);
        State::setState(object);
    } else if (*event == '/') {
        Serial.printf("[Websocket] get state segments event: %s\n", payload);
        State::setStateSegments(object);
    } else if (*event == '.') {
        handleDotEvent(payload, doc);
    } else if (*event == 'I') {
        handleIndividualLedControlEvent(payload, doc);
    } else {
        // Handle invalid or unknown event
        handleUnknownEvent(payload, doc);
    }
}

void Websocket::handleDotEvent(uint8_t *payload, const JsonDocument &_doc) {
    Angulon::ledstrip->setFFTValue(constrain(_doc[1], 0, 255));
}

void Websocket::handleIndividualLedControlEvent(uint8_t *payload, const JsonDocument &_doc) {
    JsonArrayConst colors = _doc[1].as<JsonArrayConst>();
    Angulon::ledstrip->setIndividualColors(colors);
}

void Websocket::handleUnknownEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle unknown or invalid event here
    Logger::log("Websocket", "Unknown event");
}
