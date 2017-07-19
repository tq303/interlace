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
  PointLight
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
      this.fins[i] = this.addFin(i);
      this.add( this.fins[i] );
    }

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

      // degug tracer
      const dotGeometry = new Geometry();
      dotGeometry.vertices.push(new Vector3(this.cylinderDiameter, -(1 + (this.height / 15) * i), 0));

      const dotMaterial = new PointsMaterial( { size: 1, sizeAttenuation: false } );
      const dot = new Points( dotGeometry, dotMaterial );
      dot.position.set(0,0,0);
      dot.rotateY(angle);

      group.add(dot);      

      // light
      const light = new PointLight( 0xff0000, 1, 10 );
      light.position.set(dot.position.x, dot.position.y, dot.position.z);
      light.rotateY(angle);

      group.add(light);

    }

    return group;
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