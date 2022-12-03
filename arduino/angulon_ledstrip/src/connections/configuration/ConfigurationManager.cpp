//
// Created by stein on 2-12-2022.
//

#include <WiFi.h>
#include "ConfigurationManager.h"
#include "utils/Logger.h"

char angulon_index_html[]
        PROGMEM = R"=====(
<!doctype html>
<html lang='en' dir='ltr'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
    <title>Configure</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <h1>Configure</h1>
    <form action='/configure' method='get'>
        <div class='form-group'>
            <label for='ssid'>SSID</label>
            <input type='text' class='form-control' id='ssid' name='ssid' placeholder='SSID'>
        </div>
        <div class='form-group'>
            <label for='password'>Password</label>
            <input type='password' class='form-control' id='password' name='password' placeholder='Password'>
        </div>
        <div class='form-group'>
            <label for='ledPin'>LED Pin</label>
            <input type='number' class='form-control' id='ledPin' name='ledPin' placeholder='LED Pin' min="0" value="26">
        </div>
        <div class='form-group'>
            <label for='ledCount'>LED Count</label>
            <input type='number' class='form-control' id='ledCount' name='ledCount' placeholder='LED Count' min="0" value="60">
        </div>
        <div class='form-group'>
            <label for='serverip'>Server API IP</label>
            <input type='text' class='form-control' id='serverip' name='serverip' placeholder='IP or domain of API to connect to (without port)'>
        </div>
        <div class='form-group'>
            <label for='serverport'>Server API Port</label>
            <input type='number' class='form-control' id='serverport' name='serverport' placeholder='Port of the API server to connect to'>
        </div>
        <button type='submit' class='btn btn-primary mt-3'>Submit</button>
    </form>
</div>
</body>
</html>
)=====";

void ConfigurationManager::setup() {
    Logger::log("ConfigurationManager", "Checking configuration...");
    preferences.begin("configuration", false);
    isConfigured = preferences.getBool("isConfigured", false);

    if (!isConfigured) {
        ConfigurationManager::startConfigurationMode();
    } else {
        this->setupWiFi();
    }
}

void ConfigurationManager::startConfigurationMode() {
    Logger::log("ConfigurationManager", "Starting access point for configuration...");

    WiFi.softAP(hotspotName, hotspotPassword);
    IPAddress IP = WiFi.softAPIP();

    this->setupWebserver();

    Logger::log("ConfigurationManager", "Access point started");
// Log the hotspot name + hotspotPassword where you should connect to
    Logger::log("ConfigurationManager", "Connect to the hotspot with the following credentials:");
    Logger::log("ConfigurationManager", hotspotName);
    Logger::log("ConfigurationManager", hotspotPassword);
    Logger::log("ConfigurationManager", "After connecting, navigate to:");
    Logger::log("ConfigurationManager", IP.toString().c_str());

}

void ConfigurationManager::setupWebserver() {
    server->on("/", [this]() {
        server->send(200, "text/html", angulon_index_html);
    });
    server->on("/configure", [this]() {
        this->configureDevice();
    });

    server->begin();
}

/**
 * Handler the submit of the configuration formm
 */
void ConfigurationManager::configureDevice() {
    const String ssid = server->arg("ssid");
    const String password = server->arg("password");
    const String serverip = server->arg("serverip");
    const int ledpin = server->arg("ledPin").toInt();
    const int ledCount = server->arg("ledCount").toInt();
    const int serverPort = server->arg("serverport").toInt();

    // Check if all the right values are set
    if (ssid == "" || password == "" || ledpin < 0 || ledCount < 0 || serverip == "" || serverPort < 0) {
        server->send(400, "text/plain", "Invalid parameters");
        return;
    }

    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.putString("serverip", serverip);
    preferences.putInt("ledpin", ledpin);
    preferences.putInt("ledCount", ledCount);
    preferences.putInt("serverport", serverPort);
    preferences.putBool("isConfigured", true);

    server->send(204, "text/plain");
    Logger::log("ConfigurationManager", "Saved configuration!");
    Logger::log("ConfigurationManager", "Rebooting to apply configuration");
    ESP.restart();
}

void ConfigurationManager::setupWiFi() {
    Logger::log("ConfigurationManager", "Connecting to WiFi...");
Serial.println(preferences.getString("password"));
Serial.println(preferences.getString("ssid"));
    const char *ssid = preferences.getString("ssid").c_str();
    const char *password = preferences.getString("password").c_str();

    WiFi.begin(ssid, password);

    // Try to connect to the Wi-Fi with a delay of 500 ms each time. If it does not connect after NETWORK_TIMEOUT, it will start configure mode
    while (WiFiClass::status() != WL_CONNECTED) {
        delay(500);
        Logger::log("ConfigurationManager", ".");

        if (bootButton->isPressed()) {
            countButtonPressed++;
        }

        if (countButtonPressed >= 3) {
            this->resetConfig();
        }
    }
    Logger::log("ConfigurationManager", "Connected to WiFi");
    Logger::log("ConfigurationManager", "IP address: ");
    Logger::log("ConfigurationManager", WiFi.localIP().toString().c_str());
}

void ConfigurationManager::run() {
    if (WiFiClass::status() != WL_CONNECTED && isConfigured) {
        unsigned long now = millis();
        if (now - lastTimeConnected >= NETWORK_TIMEOUT) {
            ESP.restart();
        }
    } else {
        lastTimeConnected = millis();
    }

    server->handleClient();
}

void ConfigurationManager::resetConfig() {
    Logger::log("ConfigurationManager", "Resetting ESP, rebooting");
    preferences.remove("isConfigured");
    ESP.restart();
}