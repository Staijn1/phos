//
// Created by stein on 6-12-2022.
//

#ifndef ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H
#define ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H


#include <cstdint>

struct SystemConfiguration {
    String ssid;
    String password;
    String serverip;
    String devicename;
    int serverport;
    uint16_t ledcount;
    uint8_t ledpin;
};


#endif //ANGULON_LEDSTRIP_SYSTEMCONFIGURATION_H
