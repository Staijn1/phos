#define NUMLEDS 60
#define BUILTIN_LED 2

#define INCLUDE_CUSTOM_EFFECTS
#define NETWORK_TIMEOUT 10000 // Time in milliseconds before the ESP resets when network is not connected

struct ledstate             // Data structure to store a state of a single led
{
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};
typedef struct ledstate LEDState;     // Define the datatype LEDState

LEDState main_color = { 255, 0, 0 };

int ws2812fx_speed = 196;             // Global variable for storing the delay between color changes --> smaller == faster
int ws2812fx_brightness = 196;        // Global variable for storing the brightness (255 == 100%)
int ws2812fx_mode = 0;                // Helper variable to set WS2812FX modes
