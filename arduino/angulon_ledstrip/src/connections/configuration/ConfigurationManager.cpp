//
// Created by stein on 2-12-2022.
//

#include <WiFi.h>
#include "ConfigurationManager.h"

void ConfigurationManager::setup() {
    Logger::log("ConfigurationManager", "Checking configuration...");
    preferences.begin("configuration", false);
    bool isConfigured = preferences.getBool("isConfigured", false);

    if (!isConfigured) {
        ConfigurationManager::startConfigurationMode();
    }
}

void ConfigurationManager::startConfigurationMode() {
    Logger::log("ConfigurationManager", "Starting access point for configuration...");

    WiFi.softAP(hotspotName, password);
    IPAddress IP = WiFi.softAPIP();
    Logger::log("ConfigurationManager", "Access point started");
// Log the hotspot name + password where you should connect to
    Logger::log("ConfigurationManager", "Connect to the hotspot with the following credentials:");
    Logger::log("ConfigurationManager", hotspotName);
    Logger::log("ConfigurationManager", password);
    Logger::log("ConfigurationManager", "After connecting, navigate to:");
    Logger::log("ConfigurationManager", IP.toString());
}
