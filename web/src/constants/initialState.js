import defaultFrame from './defaultFrame'
import { INACTIVE_COLOUR } from './ledDefinitions'

export default {
    frames: {
        position: 0,
        all: [ defaultFrame.map( strip => strip ) ],
        current: defaultFrame.map( strip => strip ),
        rate: 8
    },
    lights: {
        current: defaultFrame.map( strip => strip[0] ),
        level: 0,
        rotate: 0,
        rotateIndex: 0,
        allowKeyboardControls: true
    },
    swatch: INACTIVE_COLOUR,
    playing: false
}
