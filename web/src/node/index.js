// @flow

import { Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

import { LED_COUNT, STRIP_COUNT, INACTIVE_COLOUR } from 'constants/ledDefinitions';
import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';

export default class Node extends Object3D {

  box:      any;
  leds:    any;
  uniforms: any;

  constructor() {
    super();

    this.box = null;
    this.leds = [];
    this.uniforms = {
      colour: 0xff0000
    };

    this.draw();
  }

  draw() {
    this.buildLights();
    this.addBox();
  }

  addBox() {
    const geometry = new CylinderBufferGeometry(0, 2.9, 2.9, 6, false);
    geometry.rotateX(Math.PI);
    geometry.translate(0, 0, 1.5);

    this.box = new Mesh( geometry, new MeshPhongMaterial({ color: 0x434343 }) );

    this.add( this.box );
  }

  createLED() {
    const uniforms = {
      colour: { value: new Color(0xffffff) }
    };

    const geometry = new SphereBufferGeometry( .1, 8, 8 );

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: LEDFragmentShader,
      transparent: true,
      depthWrite  : false,
    });

    return {
      gl: new Mesh( geometry, material ),
      uniforms
    };
  }

  buildLights(nextFrame: any = null) {

    const mag = .2;

    for (let i = 0; i < STRIP_COUNT; i++) {
      const angle = ((2 * Math.PI) / STRIP_COUNT * i) + ((2 * Math.PI) / (STRIP_COUNT * 2));

      this.leds[i] = [];


      for (let j = 0; j < LED_COUNT; j++) {

        const led = this.createLED();

        led.gl.position.set(Math.cos(angle) * j * mag, j * mag - 1.5, Math.sin(angle) * j * mag);

        this.add(led.gl);

        this.leds[i][j] = led;
      }
    }
  }

  updateLights(nextFrame: any = []) {
    for (let i = 0; i < STRIP_COUNT; i++) {
      for (let j = 0; j < LED_COUNT; j++) {
        // this.leds[i][j].uniforms.colour.value = new Color(nextFrame[i][j]);
        this.leds[i][j].uniforms.colour.value = new Color(0xff3f00);
      }
    }
  }
}
