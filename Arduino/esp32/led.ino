#define BUILTIN_LED 2

void setupLed() {
  pinMode(BUILTIN_LED, OUTPUT);
}

void setLedOn() {
  digitalWrite(BUILTIN_LED, HIGH);
}

void setLedOff() {
  digitalWrite(BUILTIN_LED, LOW);
}

void blinkLed(int interval) {
  delay(interval / 2);
  setLedOn();
  delay(interval / 2);
  setLedOff();
}
