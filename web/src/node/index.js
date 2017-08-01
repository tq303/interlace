// @flow

import { AdditiveBlending, PointLight, Vector3, Sprite, Texture, TextureLoader, SpriteMaterial, Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

import { LED_COUNT, STRIP_COUNT, INACTIVE_COLOUR } from 'constants/ledDefinitions';
import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';
import '../../public/stats';

export default class Node extends Object3D {
  box:     Mesh;
  leds:    Array<any>;
  counter: number;
  static led_texture: Texture;
  static material1:   SpriteMaterial;
  static material2:   SpriteMaterial;

  constructor ():void {
    super();
    this.box     = null;
    this.leds    = [];
    this.counter = Math.floor(Math.random() * 10);
    this.light   = null;
    this.draw();

    //// @TODO this function shall be put in main render loop
    setInterval(this.updateLights.bind(this), 10);
  }

  draw ():void {
    this.addBox();
    this.addLights();
  }

  addBox ():void {
    const geometry = new CylinderBufferGeometry(3, 0, 3, 6, true);
    this.box = new Mesh(geometry, new MeshPhongMaterial({
      color: 0x000,
    }));
    this.add(this.box);
  }

  addLights ():void {
    const mag = .2;
    for (let i = 0; i < STRIP_COUNT; i++) {
      const angle = ((2 * Math.PI) / STRIP_COUNT * i) + ((2 * Math.PI) / (STRIP_COUNT * 2));
      const stripe = [];
      for (let j = 1; j < LED_COUNT; j++) {
        const led = new Sprite(Node.material1);
        led.scale.set(4, 4, 4);
        led.position.set(Math.cos(angle) * j * mag, j * mag - 1.5, Math.sin(angle) * j * mag);
        stripe.push(led);
        this.add(led);
      }
      this.leds.push(stripe);
    }
  }

  updateLights ():void {
    const distance = Math.abs(this.position.x) + Math.abs(this.position.z);
    const trigger = (((Date.now() - distance) / 1000) % 1) < 0.15;

    const index = ++this.counter % this.leds.length;
    for (var i = 0; i < this.leds.length; i++) {
      const stripe = this.leds[i];
      for (var j = 0; j < stripe.length; j++) {
        const led = stripe[j];
        led.material = trigger ? Node.material3 : (index === i ? Node.material2 : Node.material1);
      }
    }
  }
}

Node.led_texture = new TextureLoader().load('led.png');

Node.material1 = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0x555555,
  blending: AdditiveBlending,
});

Node.material2 = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0xbb0000,
  blending: AdditiveBlending,
});
Node.material3 = new SpriteMaterial({
  map:   Node.led_texture,
  color: 0xffffff,
  blending: AdditiveBlending,
});
