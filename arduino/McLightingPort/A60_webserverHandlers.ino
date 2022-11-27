void updateMode() {
  strip->setMode(ws2812fx_mode);
  if (ws2812fx_mode == FX_MODE_CUSTOM) {
    strip->setSegment(0, 0, ledCount - 1, FX_MODE_CUSTOM, strip->getColor(), 0, NO_OPTIONS);
  }
}

void updateBrightness() {
  strip->setBrightness(ws2812fx_brightness);
}

void updateSpeed() {
  strip->setSpeed(ws2812fx_speed);
}

void handleSetMode() {
  if (server.arg("m") != "") {
    ws2812fx_mode = constrain(server.arg("m").toInt(), 0, strip->getModeCount() - 1);
    updateMode();
  }
}

void handleSetSpeed() {
  if (server.arg("s").toInt() > 0) {
    ws2812fx_speed = constrain((int) server.arg("s").toInt(), 0, 3000);
  }

  updateSpeed();
}

void handleSetBrightness() {
  if (server.arg("percentage").toInt() > 0) {
    ws2812fx_brightness = constrain((int) server.arg("percentage").toInt() * 2.55, 0, 255);
  } else if (server.arg("absolute").toInt() > 0) {
    ws2812fx_brightness = constrain(server.arg("absolute").toInt(), 0, 255);
  }

  updateBrightness();
}
