// @flow

import * as THREE from 'three';
import {
  Camera,
  Scene,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
  AmbientLight
} from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

class Canvas {

  renderer: WebGLRenderer;
  camera:   PerspectiveCamera;
  scene:    Scene;
  controls: OrbitControls;

  constructor( width: number = 1024, height: number = 576 , loadZ: number = 200 ) {
    // scene and camera
    this.scene    = new Scene();
    this.camera   = new PerspectiveCamera( 75, width / height, 1, 10000 );
    this.camera.position.z = 25;

    this.camera.lookAt( new Vector3(0,0,0) );

    this.scene.add(new AmbientLight( 0xffffff ));

    // initialize renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize( width, height );

    // setup controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableKeys = false;

    // add to DOM
    const canvasDOM = document.getElementById('canvas')

    if (canvasDOM) canvasDOM.appendChild( this.renderer.domElement );

    // begin loop
    this.loop();
  }

  loop() {
      requestAnimationFrame( () => this.loop() );
      this.renderer.render( this.scene, this.camera );
  }
  
  radians( degrees: number ) {
      return degrees * (Math.PI / 180);
  }

  resize( width: number, height: number ) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }
}

export default Canvas;
