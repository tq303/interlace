// @flow

import * as THREE from 'three';
import { Camera, Scene, PerspectiveCamera, Vector3, WebGLRenderer, DirectionalLight, AmbientLight } from 'three';

import stats from '../lib/stats.js';

const OrbitControls = require('three-orbit-controls')(THREE);

class Canvas {
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  scene: Scene;
  controls: OrbitControls;
  stats: any;

  constructor() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // scene and camera
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, width / height, 1, 10000);

    this.camera.position.y = 99;

    // move down and back. look upwards
    // this.camera.translateY(-360);
    // this.camera.translateZ(-200);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.scene.add(new AmbientLight(0x999999));

    const directional = new DirectionalLight(0xffffff);
    directional.position.set(0, -70, 100).normalize();
    this.scene.add(directional);

    // initialize renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);

    // setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;

    // add to DOM
    const canvasDOM = document.getElementById('canvas');

    if (canvasDOM) canvasDOM.appendChild(this.renderer.domElement);

    // setup stats
    this.stats = new stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

    if (document.body) {
      document.body.appendChild(this.stats.dom);
    }

    // begin loop
    this.loop();
  }

  loop() {
    this.stats.begin();

    requestAnimationFrame(this.loop.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  }

  radians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

export default Canvas;
