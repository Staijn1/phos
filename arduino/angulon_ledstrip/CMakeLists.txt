cmake_minimum_required(VERSION 3.27)
project(angulon_ledstrip)

set(CMAKE_CXX_STANDARD 14)

include_directories(src)
include_directories(src/connections)
include_directories(src/connections/configuration)
include_directories(src/connections/OTA)
include_directories(src/connections/websocket)
include_directories(src/hardware)
include_directories(src/hardware/button)
include_directories(src/hardware/led)
include_directories(src/hardware/ledstrip)
include_directories(src/utils)
include_directories(src/utils/logger)
include_directories(src/utils/state)

add_executable(angulon_ledstrip
        src/connections/configuration/ConfigurationManager.cpp
        src/connections/configuration/ConfigurationManager.h
        src/connections/configuration/SystemConfiguration.h
        src/connections/OTA/OTA.cpp
        src/connections/OTA/OTA.h
        src/connections/websocket/Websocket.cpp
        src/connections/websocket/Websocket.h
        src/hardware/button/Button.cpp
        src/hardware/button/Button.h
        src/hardware/led/Led.cpp
        src/hardware/led/Led.h
        src/hardware/ledstrip/Ledstrip.cpp
        src/hardware/ledstrip/Ledstrip.h
        src/utils/logger/Logger.cpp
        src/utils/logger/Logger.h
        src/utils/state/State.cpp
        src/utils/state/State.h
        src/Angulon.cpp
        src/Angulon.h
        src/main.cpp)
