//
// Created by stein on 2-12-2022.
//

#include "Angulon.h"
#include "utils/state/State.h"

Ledstrip *Angulon::ledstrip = new Ledstrip();

void Angulon::setup() {
    Logger::setup();
    Angulon::ledstrip->setup();
    configuration.setup();

    if (configuration.isConfigured) {
        websocket.setup();
    }

    Logger::log("Angulon", "Setup finished");
    Serial.println( State::getStateJSON());
}


void Angulon::loop() {
    configuration.run();
    Angulon::ledstrip->run();
    if (configuration.isConfigured) {
        websocket.run();
    }
}

