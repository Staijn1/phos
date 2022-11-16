const char* hotspotName = "ESP32-Access-Point";
const char* password = "ESP32";

void initializeConfigMode() {
  preferences.begin("config", false);
  readConfig();

  if (isConfigured) {
    Serial.println("[SETUP] This device is already configured, skipping creating access point");
    return;
  }

  WiFi.softAP(hotspotName, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.printf("[SETUP] Please configure your device by connecting to the network: %s\n With password: %s\n", hotspotName, password);
  Serial.print("[SETUP] Once connected, navigate to ");
  Serial.println(IP);
}

void readConfig() {
  isConfigured = preferences.getBool("configured", false);
  ledCount = preferences.getInt("ledCount");
}

void runConfigMode() {

}

void saveConfig() {
  String message = "" ;

  const String ssid = server.arg("ssid");
  const String password = server.arg("password");
  const String serverip = server.arg("serverip");
  const int ledpin = server.arg("ledPin").toInt();
  const int ledCount = server.arg("ledCount").toInt();

  if (ssid == "" || password == "" || ledpin < 0 || ledCount < 0) {
    server.send(400, "text/plain", "Invalid parameters");
    return;
  }

  preferences.putString("ssid", ssid);
  preferences.putString("password", password);
  preferences.putString("serverip", serverip);
  preferences.putInt("ledpin", ledpin);
  preferences.putInt("ledCount", ledCount);
  preferences.putBool("configured", true);

  server.send(204, "text/plain");
  Serial.println("Saved configuration!");
  Serial.println("Rebooting to apply configuration.");
  ESP.restart();
}

void connectToWifi() {
  String ssid = preferences.getString("ssid");
  int ssidLength = ssid.length() + 1;
  char ssidChar[ssidLength];
  ssid.toCharArray(ssidChar, ssidLength);

  String password = preferences.getString("password");
  int passwordLength = password.length() + 1;
  char passwordChar[passwordLength];
  password.toCharArray(passwordChar, passwordLength);

  ticker.attach(0.5, tick);
  Serial.print("[SETUP] Connecting to ");
  Serial.println(ssidChar);

  Serial.print("[SETUP] Mac adress: ");
  Serial.println(WiFi.macAddress());
  WiFi.begin(ssidChar, passwordChar);

  Serial.print("Connecting");
  int amountButtonPressed = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    if (bootButtonPressed()) {
      amountButtonPressed++;
    }

    if (amountButtonPressed >= 10) {
      resetConfig();
    }
    Serial.print(".");
  }

  // Print local IP address and start web server
  Serial.println("");
  Serial.println("[SETUP] WiFi connected.");
  Serial.println("[SETUP] IP address: ");
  Serial.println(WiFi.localIP());


  ticker.detach();

  //keep LED on
  digitalWrite(BUILTIN_LED, HIGH);
}


void resetConfig() {
  Serial.println("Resetting ESP, rebooting");
  preferences.remove("configured");
  ESP.restart();
}
