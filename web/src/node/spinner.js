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
  CircleBufferGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Color,
} from 'three';

const LED_COUNT = 15;
const ROTATIONS = 24;

import { LEDFragmentShader, vertexShader, boxFragmentShader } from 'shaders';

export default class Node extends Object3D {
  box: Mesh;
  ledStrip: Array<any>;
  counter: number;

  static led_texture: Texture = new TextureLoader().load('led.png');
  static material: SpriteMaterial = new SpriteMaterial({
    map: Node.led_texture,
    color: 0x555555,
    blending: AdditiveBlending,
  });

  constructor(): void {
    super();
    this.box = null;
    this.ledStrip = [];
    this.draw();

    this.counter = 0;

    setInterval(this.animate.bind(this), 2);
    this.animate();
  }

  draw(): void {
    this.addBox();
    this.addLights();
    this.addPlane();
  }

  addBox(): void {
    const geometry = new CylinderBufferGeometry(2, 2, 2, 16);
    this.box = new Mesh(
      geometry,
      new MeshPhongMaterial({
        color: 0x000,
      })
    );
    this.add(this.box);
  }

  addLights(): void {
    for (let i = 0; i < LED_COUNT; i++) {
      const led = new Sprite(Node.material);
      led.material.color.setHex(0xffffff);
      led.scale.set(6, 6, 6);
      this.ledStrip.push(led);
      this.add(led);
      this.positionLights();
    }
  }

  addPlane(): void {
    const geometry = new CylinderBufferGeometry(LED_COUNT, LED_COUNT, 0, ROTATIONS);
    const material = new MeshBasicMaterial({ color: 0x000000 });
    const circle = new Mesh(geometry, material);
    this.add(circle);
  }

  positionLights(x: number = 0, y: number = 0, z: number = 0): void {
    const mag = 1;
    this.ledStrip.forEach((led, index) => {
      led.position.set(x * index, y * index, z * (index * mag));
    });
  }

  animate() {
    const speed = 0.2;

    if (this.counter === ROTATIONS) {
      this.counter = 0;
    }

    const angle = 2 * Math.PI / ROTATIONS * this.counter;
    this.positionLights(Math.cos(angle), 0, Math.sin(angle));

    this.counter += 1;
  }
}
