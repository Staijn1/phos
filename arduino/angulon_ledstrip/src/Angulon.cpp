#include "Angulon.h"
#include "utils/state/State.h"

Ledstrip* Angulon::ledstrip = new Ledstrip();
Led* Angulon::led = new Led(BUILTIN_LED);

void Angulon::setup() {
    Logger::setup();
    configuration.setup();
    Angulon::ledstrip->setup();

    if (configuration.isConfigured) {
        websocket.setup(configuration.getConfig());
        ota.setup();
    }

    Logger::log("Angulon", "Setup finished");
//    Serial.println(State::getModesJSON());
}


void Angulon::loop() {
    configuration.run();
    Angulon::ledstrip->run();
    if (configuration.isConfigured) {
        websocket.run();
        ota.run();
    }
}
