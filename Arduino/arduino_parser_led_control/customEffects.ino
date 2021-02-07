// in the custom effect run the Fire2012 algorithm
#define G_REVERSE_DIRECTION false


uint16_t fire2012Effect() {
  Fire2012();

  // return the animation speed based on the ws2812fx speed setting
  return (ws2812fx.getSpeed() / LED_COUNT);
}

uint16_t waterfallEffect() {
  waterfall();

  // return the animation speed based on the ws2812fx speed setting
  return (ws2812fx.getSpeed() / LED_COUNT);
}
/*
   paste in the Fire2012 code with a small edit at the end which uses the
   setPixelColor() function to copy the color data to the ws2812fx instance.
*/

// Fire2012 by Mark Kriegsman, July 2012
// as part of "Five Elements" shown here: http://youtu.be/knWiGsmgycY
////
// This basic one-dimensional 'fire' simulation works roughly as follows:
// There's a underlying array of 'heat' cells, that model the temperature
// at each point along the line.  Every cycle through the simulation,
// four steps are performed:
//  1) All cells cool down a little bit, losing heat to the air
//  2) The heat from each cell drifts 'up' and diffuses a little
//  3) Sometimes randomly new 'sparks' of heat are added at the bottom
//  4) The heat from each cell is rendered as a color into the leds array
//     The heat-to-color mapping uses a black-body radiation approximation.
//
// Temperature is in arbitrary units from 0 (cold black) to 255 (white hot).
//
// This simulation scales it self a bit depending on LED_COUNT; it should look
// "OK" on anywhere from 20 to 100 LEDs without too much tweaking.
//
// I recommend running this simulation at anywhere from 30-100 frames per second,
// meaning an interframe delay of about 10-35 milliseconds.
//
// Looks best on a high-density LED setup (60+ pixels/meter).
//
//
// There are two main parameters you can play with to control the look and
// feel of your fire: COOLING (used in step 1 above), and SPARKING (used
// in step 3 above).
//
// COOLING: How much does the air cool as it rises?
// Less cooling = taller flames.  More cooling = shorter flames.
// Default 50, suggested range 20-100
#define COOLING  55

// SPARKING: What chance (out of 255) is there that a new spark will be lit?
// Higher chance = more roaring fire.  Lower chance = more flickery fire.
// Default 120, suggested range 50-200.
#define SPARKING 120

void Fire2012()
{
  // Array of temperature readings at each simulation cell
  static byte heat[LED_COUNT];

  // Step 1.  Cool down every cell a little
  for ( int i = 0; i < LED_COUNT; i++) {
    heat[i] = qsub8( heat[i],  random8(0, ((COOLING * 10) / LED_COUNT) + 2));
  }

  // Step 2.  Heat from each cell drifts 'up' and diffuses a little
  for ( int k = LED_COUNT - 1; k >= 2; k--) {
    heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2] ) / 3;
  }

  // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
  if ( random8() < SPARKING ) {
    int y = random8(7);
    heat[y] = qadd8( heat[y], random8(160, 255) );
  }

  // Step 4.  Map from heat cells to LED colors
  for ( int j = 0; j < LED_COUNT; j++) {
    CRGB color = HeatColor( heat[j]);
    int pixelnumber;
    if ( G_REVERSE_DIRECTION ) {
      pixelnumber = (LED_COUNT - 1) - j;
    } else {
      pixelnumber = j;
    }


    ws2812fx.setPixelColor(pixelnumber, color.red, color.green, color.blue);
  }
}

void waterfall()
{
  // Array of temperature readings at each simulation cell
  static byte heat[LED_COUNT];

  // Step 1.  Cool down every cell a little
  for ( int i = 0; i < LED_COUNT; i++) {
    heat[i] = qsub8( heat[i],  random8(0, ((COOLING * 10) / LED_COUNT) + 2));
  }

  // Step 2.  Heat from each cell drifts 'up' and diffuses a little
  for ( int k = LED_COUNT - 1; k >= 2; k--) {
    heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2] ) / 3;
  }

  // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
  if ( random8() < SPARKING ) {
    int y = random8(7);
    heat[y] = qadd8( heat[y], random8(160, 255) );
  }

  // Step 4.  Map from heat cells to LED colors
  for ( int j = 0; j < LED_COUNT; j++) {
    CRGB color = ColdColor( heat[j]);
    int pixelnumber;
    if ( G_REVERSE_DIRECTION ) {
      pixelnumber = (LED_COUNT - 1) - j;
    } else {
      pixelnumber = j;
    }

    ws2812fx.setPixelColor(pixelnumber, color.red, color.green, color.blue);
  }
}

CRGB ColdColor( uint8_t temperature)
{
  CRGB coldcolor;

  // Scale 'heat' down from 0-255 to 0-191,
  // which can then be easily divided into three
  // equal 'thirds' of 64 units each.
  uint8_t t192 = scale8_video( temperature, 191);

  // calculate a value that ramps up from
  // zero to 255 in each 'third' of the scale.
  uint8_t coldramp = t192 & 0x3F; // 0..63
  coldramp <<= 2; // scale up to 0..252

  // now figure out which third of the spectrum we're in:
  if ( t192 & 0x80) {
    // we're in the hottest third
    coldcolor.r = coldramp; // ramp up red
    coldcolor.g = 255; // full green
    coldcolor.b = 255; // full blue
  } else if ( t192 & 0x40 ) {
    // we're in the middle third
    coldcolor.r = 0; // no red
    coldcolor.g = coldramp; // ramp up green
    coldcolor.b = 255; // full blue

  } else {
    // we're in the coolest third
    coldcolor.r = 0; // no blue
    coldcolor.g = 0; // no green
    coldcolor.b = coldramp; // ramp up blue
  }

  return coldcolor;
}
