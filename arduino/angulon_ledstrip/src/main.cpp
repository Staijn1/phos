#include <Arduino.h>
#include "Angulon.h"

const Angulon angulon;

void setup() {
    angulon.setup();
}

void loop() {
    angulon.loop();
}
