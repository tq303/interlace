import { STRIP_COUNT, LED_COUNT, INACTIVE_COLOUR } from './ledDefinitions'

let defaultFrame  = [];

for (let i = 0; i < STRIP_COUNT; i++) {
    defaultFrame[i] = [];
    for (let j = 0; j < LED_COUNT; j++) {
        defaultFrame[i][j] = INACTIVE_COLOUR;
    }
}

export default defaultFrame
