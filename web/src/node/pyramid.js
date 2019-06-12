// @flow

import {
  AdditiveBlending,
  PointLight,
  Vector3,
  Sprite,
  Texture,
  TextureLoader,
  SpriteMaterial,
  Object3D,
  SphereBufferGeometry,
  ShaderMaterial,
  Mesh,
  CylinderBufferGeometry,
  MeshPhongMaterial,
  Color
} from 'three';

import {LED_COUNT,  STRIP_COUNT, INACTIVE_COLOUR } from 'constants/ledDefinitions';
import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';

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
    const geometry = new CylinderBufferGeometry(2, 0, 2, STRIP_COUNT, true);
    this.box = new Mesh(geometry, new MeshPhongMaterial({
      color: 0x000000,
    }));
    this.add(this.box);
  }

  addLights ():void {
    const mag = .2;
    for (let i = 0; i < STRIP_COUNT; i++) {
      const angle = ((2 * Math.PI) / STRIP_COUNT * i) + (Math.PI / 2);
      const strip = [];
      for (let j = 1; j < LED_COUNT; j++) {
        const led = new Sprite(Node.material);
        led.material.color.setHex(0xffffff);
        led.scale.set(4, 4, 4);
        led.position.set(Math.cos(angle) * j * mag, j * mag - 1.2, Math.sin(angle) * j * mag);
        strip.push(led);
        this.add(led);
      }
      this.ledStrips.push(strip);
    }
  }
}

Node.led_texture = new TextureLoader().load('led.png');

Node.material = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0xffffff,
  blending: AdditiveBlending,
});
