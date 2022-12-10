//
// Created by stein on 2-12-2022.
//

#include "Angulon.h"


void Angulon::setup() {
    Logger::setup();
    configuration.setup();

    if (configuration.isConfigured) {
        websocket.setup();
    }

    Logger::log("Angulon", "Setup finished");
}


void Angulon::loop() {
    configuration.run();

    if (configuration.isConfigured) {
        websocket.run();
    }
}

