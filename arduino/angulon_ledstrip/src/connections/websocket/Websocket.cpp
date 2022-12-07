//
// Created by stein on 5-12-2022.
//

#include <map>
#include "Websocket.h"
#include "utils/Logger.h"
#include <ArduinoJson.h>

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
            Websocket::led->turnOff();
            Logger::log("Websocket", "Disconnected from server");
            break;
        case sIOtype_CONNECT:
            Websocket::led->turnOn();
            socketIO.send(sIOtype_CONNECT, "/");
            Logger::log("Websocket", "Connected to server");
            break;
        case sIOtype_EVENT: {
            Logger::log("Websocket", "Got an event from the server");
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
    StaticJsonDocument<128> doc;

    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
    }

    const char* event = doc[0]; // The first element holds the code corrosponding to the action (set color, mode, fft etc)

    // Handle the different events
    if (event == "!") {
        handleBangEvent();
    } else if (event == "#") {
        handleHashEvent();
    } else if (event == "+") {
        handlePlusEvent();
    } else if (event == "?") {
        handleQuestionEvent();
    } else if (event == "/") {
        handleSlashEvent();
    } else if (event == ".") {
        handleDotEvent();
    } else {
        // Handle invalid or unknown event
        handleUnknownEvent();
    }
}

// Event handlers for the different events
void Websocket::handleBangEvent() {
    // Increase the speed of the LED strip here
    speed += 10;
}

void Websocket::handleQuestionEvent() {
    // Decrease the speed of the LED strip here
    speed -= 10;
}

// Other event handlers
void Websocket::handleHashEvent() {
    // Handle "#" event here
}

void Websocket::handlePlusEvent() {
    // Handle "+" event here
}

void Websocket::handleSlashEvent() {
    // Handle "/" event here
}

void Websocket::handleDotEvent() {
    // Handle "." event here
}

void Websocket::handleUnknownEvent() {
    // Handle unknown or invalid event here
}
