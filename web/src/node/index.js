// @flow

import {
  Object3D,
  MeshLambertMaterial,
  Mesh,
  ExtrudeGeometry,
  Shape,
  CylinderGeometry,
} from 'three';

import { LED_COUNT } from 'constants/ledDefinitions';

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
    this.add( this.addCylinder() );

    // draw fins
    for (let i = 0; i < 6; i++) {
      this.fins.push(this.addFin(i));      
      this.add( this.fins[i] );
    }

    // draw LED strips
    // for (let i = 0; i < 6; i++) {
    //   this.strips.push(this.addStrip(i));      
    //   this.add( this.strips[i] );
    // }

  }

  addCylinder() {
    const cylinderGeo = new CylinderGeometry( this.cylinderDiameter, this.cylinderDiameter, this.height, 12 );
    cylinderGeo.translate(0,-this.height/2,0);
    return new Mesh(cylinderGeo, new MeshLambertMaterial({ color: 0xffff00 }));
  }

  addFin(position: number) {
    return new Mesh(this.finGeometry(position), new MeshLambertMaterial({ color: 0x84F9FF }));
  }

  finGeometry(position: number) {

    const angle = (2 * Math.PI) / 6 * position;
    
    const shape = new Shape();

    shape.moveTo(this.cylinderDiameter,1);
    shape.lineTo(this.cylinderDiameter,-this.height);
    shape.lineTo(this.cylinderDiameter + (this.height / 3),-(this.height / 3) * 2);

    const geometry = new ExtrudeGeometry( shape, {amount: .3, bevelEnabled: false} );

    geometry.rotateY(angle);

    geometry.translate(0,0,.15);

    return geometry;
  }
}