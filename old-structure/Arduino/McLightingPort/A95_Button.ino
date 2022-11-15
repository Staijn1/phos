
// Configure the built in BOOT-button as an input, which can be used to reset the chips configuration
void setupButton() {
  pinMode(0, INPUT);
}

boolean bootButtonPressed() {
  return digitalRead(0) == 0;
}
