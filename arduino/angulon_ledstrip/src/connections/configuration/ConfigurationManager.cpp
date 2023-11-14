//
// Created by stein on 2-12-2022.
//

#include <WiFi.h>
#include "ConfigurationManager.h"
#include "utils/logger/Logger.h"

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
            <input type='text' class='form-control' id='ssid' name='ssid' placeholder='SSID' value='{{ssid}}'>
        </div>
        <div class='form-group'>
            <label for='password'>Password</label>
            <input type='password' class='form-control' id='password' name='password' placeholder='Password' value='{{password}}'>
        </div>
        <div class='form-group'>
            <label for='ledpin'>LED Pin</label>
            <input type='number' class='form-control' id='ledpin' name='ledpin' placeholder='LED Pin' min="0" value="26" value='{{ledpin}}'>
        </div>
        <div class='form-group'>
            <label for='ledcount'>LED Count</label>
            <input type='number' class='form-control' id='ledcount' name='ledcount' placeholder='LED Count' min="0" value="{{ledcount}}">
        </div>
        <div class='form-group'>
            <label for='serverip'>Server API IP</label>
            <input type='text' class='form-control' id='serverip' name='serverip' placeholder='IP or domain of API to connect to (without port)' value='{{serverip}}'>
        </div>
        <div class='form-group'>
            <label for='serverport'>Server API Port</label>
            <input type='number' class='form-control' id='serverport' name='serverport' placeholder='Port of the API server to connect to' value='{{serverport}}'>
        </div>
        <div class='form-group'>
            <label for='devicename'>Device Name</label>
            <input type='text' class='form-control' id='devicename' name='devicename' placeholder='Name of this device' value='{{devicename}}'>
        </div>
        <button type='submit' class='btn btn-primary mt-3'>Submit</button>
    </form>
</div>
</body>
</html>
)=====";

SystemConfiguration ConfigurationManager::systemConfiguration;

void ConfigurationManager::setup() {
    Logger::log("ConfigurationManager", "Checking configuration...");
    preferences.begin("configuration", false);
    isConfigured = preferences.getBool("isConfigured", false);

    if (!isConfigured) {
        ConfigurationManager::startConfigurationMode();
    } else {
        this->loadConfiguration();
        this->setupWiFi();
    }
    this->setupWebserver();
}

void ConfigurationManager::startConfigurationMode() {
    Logger::log("ConfigurationManager", "Starting access point for configuration...");

    WiFi.softAP(hotspotName, hotspotPassword);
    IPAddress IP = WiFi.softAPIP();

    Logger::log("ConfigurationManager", "Access point started");
    Logger::log("ConfigurationManager", "Connect to the hotspot with the following credentials:");
    Logger::log("ConfigurationManager", hotspotName);
    Logger::log("ConfigurationManager", hotspotPassword);
    Logger::log("ConfigurationManager", "After connecting, navigate to:");
    Logger::log("ConfigurationManager", IP.toString().c_str());

}

void ConfigurationManager::setupWebserver() {
    server->on("/", [this]() {
        SystemConfiguration configuration = ConfigurationManager::getConfig();
        String ssid = configuration.ssid;
        String password = configuration.password;
        String deviceName = configuration.devicename;
        String ledpin = configuration.ledpin == (uint8_t) -1 ? "" : String(configuration.ledpin);
        String ledcount = configuration.ledcount == (uint8_t) -1 ? "" : String(configuration.ledcount);
        String serverip = configuration.serverip;
        String serverport = configuration.serverport == -1 ? "" : String(configuration.serverport);

        String html = angulon_index_html;
        html.replace("{{ssid}}", ssid);
        html.replace("{{password}}", password);
        html.replace("{{ledpin}}", ledpin);
        html.replace("{{ledcount}}", ledcount);
        html.replace("{{serverip}}", serverip);
        html.replace("{{serverport}}", serverport);
        html.replace("{{devicename}}", deviceName);
        server->send(200, "text/html", html);
    });
    server->on("/configure", [this]() {
        this->configureDevice();
    });
    server->on("/reconfigure", [this]() {
        Logger::log("ConfigurationManager", "Reconfiguring device");
        preferences.putBool("isConfigured", false);
        ESP.restart();
    });
    server->on("/restart", [this]() {
        Logger::log("ConfigurationManager", "Rebooting...");
        ESP.restart();
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
    const String deviceName = server->arg("devicename");
    const int ledpin = server->arg("ledpin").toInt();
    const int ledcount = server->arg("ledcount").toInt();
    const int serverPort = server->arg("serverport").toInt();

    // Check if all the right values are set
    if (ssid == "" || password == "" || deviceName == "" || ledpin <= 0 || ledcount <= 0 || serverip == "" || serverPort <= 0) {
        server->send(400, "text/plain", "Invalid parameters");
        return;
    }

    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.putString("serverip", serverip);
    preferences.putString("devicename", deviceName);
    preferences.putInt("ledpin", ledpin);
    preferences.putInt("ledcount", ledcount);
    preferences.putInt("serverport", serverPort);
    preferences.putBool("isConfigured", true);

    server->send(204, "text/plain");
    Logger::log("ConfigurationManager", "Saved configuration!");
    Logger::log("ConfigurationManager", "Rebooting to apply configuration");
    ESP.restart();
}

void ConfigurationManager::setupWiFi() {
    SystemConfiguration configuration = ConfigurationManager::getConfig();
    this->ssid = configuration.ssid.c_str();
    this->networkPassword = configuration.password.c_str();

    WiFi.begin(this->ssid, this->networkPassword);
    Logger::log("ConfigurationManager", "Connecting to WiFi network: " + configuration.ssid);

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
    server->handleClient();

    // We only need to perform the Wi-Fi connection check if the system is configured
    if (!isConfigured) return;

    if (WiFiClass::status() != WL_CONNECTED) {
        unsigned long now = millis();
        if (now - lastTimeConnected >= NETWORK_TIMEOUT) {
            Logger::log("ConfigurationManager", "Could not connect to WiFi - Resetting!");
            ESP.restart();
        }
    } else {
        lastTimeConnected = millis();
    }
}

void ConfigurationManager::resetConfig() {
    Logger::log("ConfigurationManager", "Resetting ESP, rebooting");
    preferences.remove("isConfigured");
    ESP.restart();
}

SystemConfiguration ConfigurationManager::getConfig() {
    return systemConfiguration;
}

void ConfigurationManager::loadConfiguration() {
    SystemConfiguration config{};
    // Generate a default device name based on the MAC address
    String defaultDeviceName = "ESP32 - " + WiFi.macAddress();
    config.ssid = preferences.getString("ssid", "");
    config.password = preferences.getString("password", "");
    config.serverip = preferences.getString("serverip", "");
    config.ledpin = preferences.getInt("ledpin", -1);
    config.ledcount = preferences.getInt("ledcount", -1);
    config.serverport = preferences.getInt("serverport", -1);
    config.devicename = preferences.getString("devicename", defaultDeviceName);
    systemConfiguration = config;
}
