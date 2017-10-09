import dat from "dat";
import { Vector2, Raycaster } from 'three';

import Canvas from 'canvas';
import Node   from 'node';
import Grid   from './grid';

let INTERSECTED;

const grid   = new Grid();
const canvas = new Canvas();

canvas.scene.add(grid);

const gui = new dat.GUI();
gui.add(grid, 'tileSize', 10, 100).onChange(value => grid.update());
gui.add(grid, 'showWeb').onChange(value => grid.update());

const nodes = grid.nodes.map(n => n.node.box);

function handleMouseEvent(e) {
  e.preventDefault();

  const mouse = new Vector2();
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

  const raycaster = new Raycaster();
  raycaster.setFromCamera( mouse, canvas.camera );
  const intersects = raycaster.intersectObjects( nodes );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED !== intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material.color.setHex( 0x500b82 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }
}

document.addEventListener('mousemove', handleMouseEvent);
