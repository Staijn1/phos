//
// Created by stein on 5-12-2022.
//

#include <map>
#include "Websocket.h"
#include "utils/Logger.h"

void Websocket::setup() {
    Logger::log("Websocket", "Setting up websocket connection");
    LedstripConfiguration configuration = configurationManager->getConfig();
    socketIO.begin(configuration.serverip, configuration.serverport, "/socket.io/?EIO=4");
    socketIO.onEvent([&](socketIOmessageType_t type, uint8_t *payload, size_t length) {
        Serial.printf("[IOc] get event: %s\n", payload);
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
    Serial.printf("%s\n", payload);
    const char *event = doc[0];// The first element holds the code corrosponding to the action (set color, mode, fft etc)
    // Handle the different events
    if (*event == '!') {
        handleBangEvent(payload, doc);
    } else if (*event == '#') {
        JsonArray colors = doc[1];
        Serial.println("Here");
        handleHashEvent(colors);
    } else if (*event == '+') {
        handlePlusEvent(payload, doc);
    } else if (*event == '-') {
        handleMinusEvent(payload, doc);
    } else if (*event == '?') {
        handleQuestionEvent(payload, doc);
    } else if (*event == '/') {
        handleSlashEvent(doc[1]);
    } else if (*event == '.') {
        handleDotEvent(payload, doc);
    } else {
        // Handle invalid or unknown event
        handleUnknownEvent(payload, doc);
    }
}

// Event handlers for the different events
void Websocket::handleBangEvent(uint8_t *payload, const JsonDocument &_doc) {
    this->ledstrip->decreaseSpeedDelay();
}

void Websocket::handleQuestionEvent(uint8_t *payload, const JsonDocument &_doc) {
    this->ledstrip->increaseSpeedDelay();
}

// Other event handlers
void Websocket::handleHashEvent(const JsonArray colors) {
    // The output values
    uint32_t convertedColors[MAX_NUM_COLORS];
    int index = 0;
    // Loop over the hexadecimal strings
    for (JsonVariant color: colors) {
        // Get the string value at the current index
        std::string hex_str = color.as<std::string>();
        // Remove the prefix from the hexadecimal string
        std::string hex_str_without_prefix = hex_str.substr(1);
        // Convert the hexadecimal string to a uint32_t value
        convertedColors[index] = strtoul(hex_str_without_prefix.c_str(), nullptr, 16);
        index++;
    }

    ledstrip->setColors(0, convertedColors);
}

void Websocket::handlePlusEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle "+" event here
    this->ledstrip->increaseBrightness();
}

void Websocket::handleMinusEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle "+" event here
    this->ledstrip->decreaseBrightness();
}

void Websocket::handleSlashEvent(int mode) {
    this->ledstrip->setMode(mode);
}

void Websocket::handleDotEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle "." event here
    Logger::log("Websocket", ". event not implemented");
}

void Websocket::handleUnknownEvent(uint8_t *payload, const JsonDocument &_doc) {
    // Handle unknown or invalid event here
    Logger::log("Websocket", "Unknown event");
}
