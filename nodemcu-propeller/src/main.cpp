#include <Arduino.h>
#include <FastLED.h>

#define LED_COUNT 15

#define STRIP_1_PIN 5
#define STRIP_2_PIN 6
#define STRIP_3_PIN 7

#define REED_1_PIN D1
#define REED_2_PIN D2
#define REED_3_PIN D3

CRGB strip_1[LED_COUNT];
CRGB strip_2[LED_COUNT];
CRGB strip_3[LED_COUNT];

void horizon_animation();
void all_animation();
void detect_reed();

void setup() {
  // Serial.begin(9600);
  // Serial.println("Serial enabled");

  FastLED.addLeds<WS2812B, STRIP_1_PIN, RGB>(strip_1, LED_COUNT);
  FastLED.addLeds<WS2812B, STRIP_2_PIN, RGB>(strip_2, LED_COUNT);
  FastLED.addLeds<WS2812B, STRIP_3_PIN, RGB>(strip_3, LED_COUNT);

  pinMode(REED_1_PIN, INPUT);
  pinMode(REED_2_PIN, INPUT);
  pinMode(REED_3_PIN, INPUT);
}

void loop() {
  detect_reed();
  // horizon_animation();
}

void horizon_animation() {
  for (int8_t i = 0; i < LED_COUNT; i++) {
    strip_1[i] = CRGB::Red;
    strip_2[i] = CRGB::Red;
    strip_3[i] = CRGB::Red;
    FastLED.show();
    delay(10);
  }
  for (int8_t i = 0; i < LED_COUNT; i++) {
    strip_1[i] = CRGB::Black;
    strip_2[i] = CRGB::Black;
    strip_3[i] = CRGB::Black;
    FastLED.show();
    delay(10);
  }
}

// void all_animation(int strip, bool on = false) {
//   for (int8_t i = 0; i < LED_COUNT; i++) {
//     switch(strip) {
//       case 1:
//         strip_1[i] = on ? CRGB::White : CRGB::Black;
//         break;
//       case 2:
//         strip_2[i] = on ? CRGB::White : CRGB::Black;
//         break;
//       case 3:
//         strip_3[i] = on ? CRGB::White : CRGB::Black;
//         break;
//     }
//     FastLED.show();
//   }
// }

void detect_reed() {
  int reed_1_state = digitalRead(REED_1_PIN);
  int reed_2_state = digitalRead(REED_2_PIN);
  int reed_3_state = digitalRead(REED_3_PIN);

  // Serial.println(reed_1_state);

  if (reed_1_state == HIGH) {
    // Serial.println("reed_state_1 is HIGH");
    horizon_animation();
  } else if (reed_2_state == HIGH) {
    // Serial.println("reed_state_2 is HIGH");
    horizon_animation();
  } else if (reed_3_state != HIGH) {
    // Serial.println("reed_state_3 is HIGH");
    horizon_animation();
  }
  
  delay(1);
}