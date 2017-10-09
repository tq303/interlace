// @flow

import { AdditiveBlending, PointLight, Vector3, Sprite, Texture, TextureLoader, SpriteMaterial, Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

const LED_COUNT = 15;
const STRIP_COUNT = 2;

import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';
import '../../public/stats';

export default class Node extends Object3D {
  box:     Mesh;
  ledStrips:    Array<any>;
  counter: number;
  static led_texture: Texture;
  static material:   SpriteMaterial;

  constructor ():void {
    super();
    this.box = null;
    this.ledStrips = [];
    this.draw();

    this.counter = 0;

    // setInterval(this.animate.bind(this), 500);
    // this.animate();
  }

  draw ():void {
    this.addBox();
    this.addLights();
  }

  addBox ():void {
    const geometry = new CylinderBufferGeometry(2, 2, 2, 16);
    this.box = new Mesh(geometry, new MeshPhongMaterial({
      color: 0x000,
    }));
    this.add(this.box);
  }

  addLights ():void {
    const mag = 2.2;
    for (let j = 0; j < STRIP_COUNT; j++) {
      const strip = [];
      for (let i = 0; i < LED_COUNT; i++) {
        const angle = ((2 * Math.PI) / LED_COUNT * i);
        const led = new Sprite(Node.material);
        led.material.color.setHex(0xffffff);
        led.scale.set(6, 6, 6);
        led.position.set(Math.cos(angle) * mag, j - .5, Math.sin(angle) * mag);
        strip.push(led);
        this.add(led);
      }      
      this.ledStrips.push(strip);
    }
  }

  animate() {
    if (this.counter === LED_COUNT) {
      this.counter = 0;
    }

    this.ledStrips.forEach(strip => {
      strip.forEach((led, index) => {
        led.material.color.setHex(0x000);
      });
      strip[this.counter].material.color.setHex(0xfff);
    });

    this.counter+=1;
  }
}

Node.led_texture = new TextureLoader().load('led.png');

Node.material = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0x555555,
  blending: AdditiveBlending,
});
