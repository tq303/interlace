#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

Adafruit_NeoPixel strip;

// uint32_t Colour(uint8_t r, uint8_t g, uint8_t b) {
  // return ((uint32_t)r << 16) | ((uint32_t)g <<  8) | b;
// }

void setup() {

  strip = Adafruit_NeoPixel(30, 2, NEO_GRB + NEO_KHZ800);

  for (uint16_t i = 0; i < 30; i++) {
    strip.setPixelColor(i, 0xffffff);
  }

  Serial.begin(9600);
}

void loop() {
  delay(1000);
  Serial.println("Hello World!");
}