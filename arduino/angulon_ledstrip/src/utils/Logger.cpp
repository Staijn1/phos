//
// Created by stein on 2-12-2022.
//

#include <Arduino.h>
#include "Logger.h"

/*
 * Create a logger by opening the serial port
 */
void Logger::setup() {
    Serial.begin(115200);
}

/**
 * Log a message to the serial port in the format:
 * [className] message
 * @param className
 * @param message
 */
void Logger::log(const char *className, const char *message) {
    Serial.print("[");
    Serial.print(className);
    Serial.print("] ");
    Serial.println(message);
}
