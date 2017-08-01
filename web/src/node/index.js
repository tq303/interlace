// @flow

import { Sprite, TextureLoader, SpriteMaterial, Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

import { LED_COUNT, STRIP_COUNT, INACTIVE_COLOUR } from 'constants/ledDefinitions';
import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';
import '../../public/stats';

const led_texture = new TextureLoader().load('led.png');

export default class Node extends Object3D {
  box:      any;
  leds:     any;
  uniforms: any;

  constructor ():void {
    super();

    this.box = null;
    this.materials = [];
    this.uniforms = {
      colour: 0xff0000
    };

    this.draw();
    this.counter = 0;
    setInterval(this.updateLights.bind(this), 100);
  }

  draw ():void {
    this.addBox();
    this.addLights();
  }

  addBox ():void {
    const geometry = new CylinderBufferGeometry(3, 0, 3, 6, true);
    this.box = new Mesh(geometry, new MeshPhongMaterial({
      color: 0x434343,
    }));
    this.add(this.box);
  }

  addLights ():void {
    const mag = .2;
    for (let i = 0; i < STRIP_COUNT; i++) {
      const material = new SpriteMaterial({
        map:   led_texture,
        color: 0xffffff,
      });
      const angle = ((2 * Math.PI) / STRIP_COUNT * i) + ((2 * Math.PI) / (STRIP_COUNT * 2));
      for (let j = 0; j < LED_COUNT; j++) {
        const led = new Sprite(material);
        led.position.set(Math.cos(angle) * j * mag, j * mag - 1.5, Math.sin(angle) * j * mag);
        this.add(led);
        this.materials.push(material);
      }
    }
  }

  updateLights ():void {
    this.materials[this.counter % this.materials.length].color.set(0xffffff);
    this.materials[this.counter % this.materials.length].needsUpdate = true;
    this.counter++;
    this.materials[this.counter % this.materials.length].color.set(0x0066CC);
    this.materials[this.counter % this.materials.length].needsUpdate = true;
  }
}
