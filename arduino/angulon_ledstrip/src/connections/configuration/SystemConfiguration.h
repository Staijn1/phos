//
// Created by stein on 6-12-2022.
//

#ifndef ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H
#define ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H


#include <cstdint>

struct SystemConfiguration {
    const char *ssid;
    const char *password;
    const char *serverip;
    int serverport;
    uint16_t ledcount;
    uint8_t ledpin;
};


#endif //ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H
