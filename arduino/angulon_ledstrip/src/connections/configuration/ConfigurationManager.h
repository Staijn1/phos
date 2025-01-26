//
// Created by stein on 2-12-2022.
//

#ifndef ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H
#define ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H

#include <Preferences.h>
#include <WebServer.h>
#include "hardware/button/Button.h"
#include "SystemConfiguration.h"


/**
 * This class manages the configuration of this ledstrip.
 * If it detects this ledstrip is not coonfigured, it will start the configuration mode.
 * This configuration mode will start a wifi access point and a webserver where the user can configure the ledstrip.
 * After the configuration is done, the ledstrip will restart and connect to the configured wifi network.
 *
 */
class ConfigurationManager {
private:
    WebServer *server = new WebServer(80);
    Preferences preferences;
    Button *bootButton = new Button(0);

    const char *hotspotName = "ESP32-Access-Point";
    const char *ssid = "<<empty>>";
    const char *networkPassword = "<<empty>>";

    unsigned long lastTimeConnected = 0L;
    int countButtonPressed = 0;

    void setupWebserver();

    void setupWiFi();

    void loadConfiguration();

public:
    bool isConfigured = false;

    void setup();

    void startConfigurationMode();

    void configureDevice();

    void run();

    void resetConfig();

    static SystemConfiguration getConfig();

    static SystemConfiguration systemConfiguration;
};

#endif //ANGULON_LEDSTRIP_CONFIGURATIONMANAGER_H
