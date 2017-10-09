import dat from "dat";
import { Vector2, Raycaster } from 'three';

import Canvas from 'canvas';
import Node   from 'node';
import Grid   from './grid';

let INTERSECTED_NODE;

const grid   = new Grid();
const canvas = new Canvas();

canvas.scene.add(grid);

const gui = new dat.GUI();
gui.add(grid, 'tileSize', 10, 100).onChange(value => grid.update());
gui.add(grid, 'showWeb').onChange(value => grid.update());

const boxes = grid.nodes.map(n => n.node.box);

let ticking = false;

function handleMouseEvent(e) {
  e.preventDefault();

  if (ticking) return;

  ticking = true;

  const mouse = new Vector2();
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

  const raycaster = new Raycaster();
  raycaster.setFromCamera( mouse, canvas.camera );
  const intersects = raycaster.intersectObjects( boxes );

  if (intersects.length > 0) {

    if (INTERSECTED_NODE !== intersects[ 0 ].object) {

      if (INTERSECTED_NODE) {
        INTERSECTED_NODE.material.color.setHex( INTERSECTED_NODE.currentHex );
      }

      INTERSECTED_NODE = intersects[ 0 ].object;
      INTERSECTED_NODE.currentHex = INTERSECTED_NODE.material.color.getHex();
      INTERSECTED_NODE.material.color.setHex( 0x500b82 );

      const INTERACTING_NODE = grid.nodes.find(n => n.node.box === INTERSECTED_NODE);

      console.log(INTERACTING_NODE);
    } else {

      if (INTERSECTED_NODE) {
        INTERSECTED_NODE.material.color.setHex( INTERSECTED_NODE.currentHex );
      }

      INTERSECTED_NODE = null;
    }

  }

  const timeout = setTimeout(() => {
    ticking = false;
    clearTimeout(timeout);
  }, 250);
}

document.addEventListener('mousemove', handleMouseEvent);
