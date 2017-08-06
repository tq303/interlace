// @flow

import { AdditiveBlending, PointLight, Vector3, Sprite, Texture, TextureLoader, SpriteMaterial, Object3D, SphereBufferGeometry, ShaderMaterial, Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

import { LED_COUNT, STRIP_COUNT, INACTIVE_COLOUR } from 'constants/ledDefinitions';
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
    this.box     = null;
    this.ledStrips    = [];
    this.counter = 0;
    this.light   = null;
    this.draw();

    //// @TODO this function shall be put in main render loop
    // setInterval(this.animateFlashOutwards.bind(this), 10);
    setInterval(this.animatePulse.bind(this), 10);
  }

  draw ():void {
    this.addBox();
    this.addLights();
  }

  addBox ():void {
    const geometry = new CylinderBufferGeometry(2, 0, 2, STRIP_COUNT, true);
    this.box = new Mesh(geometry, new MeshPhongMaterial({
      color: 0x000,
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
        led.scale.set(4, 4, 4);
        led.position.set(Math.cos(angle) * j * mag, j * mag - 1.2, Math.sin(angle) * j * mag);
        strip.push(led);
        this.add(led);
      }
      this.ledStrips.push(strip);
    }
  }

  animatePulse() {
    const onOff = ++this.counter & 1;
    for (var i = 0; i < this.ledStrips.length; i++) {
      const strip = this.ledStrips[i];
      for (var j = 0; j < strip.length; j++) {
        const led = strip[j];
        const hexColour = onOff ? 0xffffff : 0x000000;
        led.material.color.setHex(hexColour);
      }
    }
  }

  animateFlashOutwards ():void {
    const distance = Math.abs(this.position.x) + Math.abs(this.position.z);
    const trigger = (((Date.now() - distance) / 1000) % 1) < 0.15;

    const index = ++this.counter % this.ledStrips.length;
    for (var i = 0; i < this.ledStrips.length; i++) {
      const strip = this.ledStrips[i];
      for (var j = 0; j < strip.length; j++) {
        const led = strip[j];
        const hexColour = trigger ? 0xffffff : (index === i ? 0xbb0000 : 0x555555);
        led.material.color.setHex(hexColour);
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
