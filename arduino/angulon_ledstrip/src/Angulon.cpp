//
// Created by stein on 2-12-2022.
//

#include "Angulon.h"
#include "utils/state/State.h"

Ledstrip *Angulon::ledstrip = new Ledstrip();
Led *Angulon::led = new Led(BUILTIN_LED);

void Angulon::setup() {
    Logger::setup();
    configuration.setup();
    Angulon::ledstrip->setup();

    if (configuration.isConfigured) {
        websocket.setup();
        ota.setup();
    }

    Logger::log("Angulon", "Setup finished");
    Serial.println( State::getStateJSON());
}


void Angulon::loop() {
    configuration.run();
    Angulon::ledstrip->run();
    if (configuration.isConfigured) {
        websocket.run();
        ota.run();
    }
}

