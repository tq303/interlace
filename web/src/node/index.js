// @flow

import { Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry } from 'three';

import { LED_COUNT, STRIP_COUNT } from 'constants/ledDefinitions';
import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';

export default class Node extends Object3D {

  strips: any;
  box:    any;

  constructor() {
    super();

    this.box = null;
    this.strips = [];

    this.draw();
  }

  draw() {

    this.box = this.addBox();
    this.add( this.box );

    for (let i = 0; i < STRIP_COUNT; i++) {
      this.strips[i] = this.addLEDStrip(i);
      this.add( this.strips[i] );
    }
  }

  addBox() {
    const geometry = new CylinderBufferGeometry(0, 2.9, 2.9, 6, false);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, 0, 1.5);

    const material = new ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader: boxFragmentShader,
      // transparent: true,
      // depthWrite  : false,
    });

    return new Mesh( geometry, material );
  }
  
  addLEDStrip(position: number) {
    const group = new Object3D();
    const angle = ((2 * Math.PI) / STRIP_COUNT * position) + ((2 * Math.PI) / (STRIP_COUNT * 2));
    const mag = .2;

    for (let i = 0; i < LED_COUNT; i++) {

      const LED = this.createLED();

      LED.position.set(Math.cos(angle) * i * mag, Math.sin(angle) * i * mag, i * mag);

      group.add(LED);
    }

    return group;
  }

  createLED() {
    const geometry = new SphereBufferGeometry( .1, 8, 8 );

    const material = new ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader: LEDFragmentShader,
      transparent: true,
      depthWrite  : false,
    });

    return new Mesh( geometry, material );
  }
}