// @flow

import {
  Object3D,
  MeshLambertMaterial,
  Mesh,
  ExtrudeBufferGeometry,
  Shape,
  CylinderBufferGeometry,
  SpotLight,
  Vector3,
  Geometry,
  PointsMaterial,
  Points,
  PointLight,
  BackSide,
  AdditiveBlending,
  ShaderMaterial,
  SphereGeometry,
  MeshBasicMaterial
} from 'three';

import { LED_COUNT } from 'constants/ledDefinitions';
import { fragmentShader, vertexShader } from 'shaders';

export default class Node extends Object3D {

  fins:             any;
  strips:           any;
  cylinderDiameter: number;
  offsetFin:        number;
  wireframe:        boolean;
  height:           number;
  tes: any;

  constructor() {
    super();

    this.fins = [];
    this.strips = [];
    this.cylinderDiameter = 2;
    this.offsetFin = this.cylinderDiameter;
    this.wireframe = true;
    this.height = 11;

    this.draw();
  }

  draw() {

    // draw cylinder
    // this.add( this.addCylinder() );

    // draw fins
    // for (let i = 0; i < 6; i++) {
    //   this.fins[i] = this.addFin(i);
    //   this.add( this.fins[i] );
    // }

    // draw LED strips
    for (let i = 0; i < 6; i++) {
      this.strips[i] = this.addStrip(i);
      this.add( this.strips[i] );
    }

  }

  addCylinder() {
    const cylinderGeo = new CylinderBufferGeometry( this.cylinderDiameter, this.cylinderDiameter, this.height, 12 );
    cylinderGeo.translate(0,-this.height/2,0);
    return new Mesh(cylinderGeo, new MeshLambertMaterial({ color: 0x656565 }));
  }

  addFin(position: number) {
    return new Mesh(this.finGeometry(position), new MeshLambertMaterial({ color: 0x494949 }));
  }

  addStrip(position: number) {
    const group = new Object3D();
    const angle = ((2 * Math.PI) / 6 * position) + ((2 * Math.PI) / (6 * 2));

    for (let i = 0; i < 15; i++) {

      const LED = this.createLED();

      LED.position.set(Math.cos(angle) * i * .8, Math.sin(angle) * i * .8, i * .8);
      // LED.rotateY(30 * (180 / Math.PI));

      group.add(LED);      

      // light
      // const light = new PointLight( 0xff0000, 1, 100 );
      // light.position.set(LED.position.x, LED.position.y, LED.position.z);

      // group.add(light);

    }

    return group;
  }

  createLED() {
    const dotGeometry = new SphereGeometry( .1, 32, 32 );

    const dotMaterial = new ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite  : false,
    });

    return new Mesh( dotGeometry, dotMaterial );
  }

  finGeometry(position: number) {

    const angle = (2 * Math.PI) / 6 * position;
    
    const shape = new Shape();

    shape.moveTo(this.cylinderDiameter,1);
    shape.lineTo(this.cylinderDiameter,-this.height);
    shape.lineTo(this.cylinderDiameter + (this.height / 3),-(this.height / 3) * 2);

    const geometry = new ExtrudeBufferGeometry( shape, {amount: .3, bevelEnabled: false} );

    geometry.rotateY(angle);

    geometry.translate(0,0,.15);

    return geometry;
  }
}