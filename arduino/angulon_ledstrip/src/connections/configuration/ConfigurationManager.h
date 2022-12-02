//
// Created by stein on 2-12-2022.
//

#ifndef ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H
#define ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H

#include <Preferences.h>
#include <WebServer.h>

/**
 * This class manages the configuration of this ledstrip.
 * If it detects this ledstrip is not coonfigured, it will start the configuration mode.
 * This configuration mode will start a wifi access point and a webserver where the user can configure the ledstrip.
 * After the configuration is done, the ledstrip will restart and connect to the configured wifi network.
 *
 */
class ConfigurationManager {
private:
    WebServer* server = new WebServer(80);
    Preferences preferences;
    const char *hotspotPassword = "ESP32-Configure";
    const char *hotspotName = "ESP32-Access-Point";
    bool isConfigured = false;
    unsigned long lastTimeConnected = 0L;
    #define NETWORK_TIMEOUT 10000

    void setupWebserver();
    void setupWiFi();
public:
    void setup();

    void startConfigurationMode();

    void configureDevice();

    void run();
};
#endif //ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H
