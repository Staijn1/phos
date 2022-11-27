void handleSetMainColor(uint8_t* mypayload) {
  // decode rgb data
  uint32_t rgb = (uint32_t) strtol((const char *) &mypayload, NULL, 16);
  handleSetMainColor(rgb);
}

void handleSetMainColor(uint32_t rgb) {
  main_color.red = ((rgb >> 16) & 0xFF);
  main_color.green = ((rgb >> 8) & 0xFF);
  main_color.blue = ((rgb >> 0) & 0xFF);
  strip->setColor(main_color.red, main_color.green, main_color.blue);
}

void handleSetWS2812FXMode(uint8_t * mypayload) {
  uint8_t ws2812fx_mode_tmp = (uint8_t) strtol((const char *) &mypayload, NULL, 10);
  ws2812fx_mode = constrain(ws2812fx_mode_tmp, 0, strip->getModeCount() - 1);

  updateMode();
}
