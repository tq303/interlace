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
    const mag = 2.3;
    for (let j = 0; j < STRIP_COUNT; j++) {
      for (let i = 0; i < LED_COUNT; i++) {
        const angle = ((2 * Math.PI) / LED_COUNT * i);
        const strip = [];
        const led = new Sprite(Node.material);
        led.material.color.setHex(0xffffff);
        led.scale.set(4, 4, 4);
        led.position.set(Math.cos(angle) * mag, j - .5, Math.sin(angle) * mag);
        strip.push(led);
        this.add(led);
        this.ledStrips.push(strip);
      }      
    }
  }
}

Node.led_texture = new TextureLoader().load('led.png');

Node.material = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0x555555,
  blending: AdditiveBlending,
});
