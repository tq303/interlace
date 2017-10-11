import dat from "dat";
import { Vector2, Raycaster } from 'three';

import Canvas from 'canvas';
import Node   from 'node';
import Grid   from './grid';

let INTERSECTED_NODE;
let HOVER_NODE;

const grid   = new Grid();
const canvas = new Canvas();

canvas.scene.add(grid);

// gui
const gui = new dat.GUI();
gui.add(grid, 'tileSize', 10, 100).onChange(value => grid.updateNodePositions());
gui.add(grid, 'showWeb').onChange(value => grid.showAllConnection());
gui.add(canvas.camera.position, 'y', 0, 400);
gui.add(grid, 'showHover').onChange((value) => {
  if (HOVER_NODE) {
    grid.showConnections(HOVER_NODE.q, HOVER_NODE.r, false);
  }
});

// mouse detection
const boxes = grid.nodes.map(n => n.node.box);

let ticking = false;

function handleMouseEvent(e) {
  e.preventDefault();

  if (ticking) {
    const timeout = setTimeout(() => {
      ticking = false;
      clearTimeout(timeout);
    }, 250);
    return;
  }

  ticking = true;
  
  const mouse = new Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new Raycaster();
  raycaster.setFromCamera(mouse, canvas.camera);
  const intersects = raycaster.intersectObjects(boxes);

  if (intersects.length > 0) {

    if (INTERSECTED_NODE !== intersects[ 0 ].object) {

      if (INTERSECTED_NODE) {
        INTERSECTED_NODE.material.color.setHex(INTERSECTED_NODE.currentHex);
      }

      INTERSECTED_NODE = intersects[ 0 ].object;
      HOVER_NODE = grid.nodes.find(n => n.node.box === INTERSECTED_NODE);

      grid.showHideNode(HOVER_NODE, true);

      grid.showConnections(HOVER_NODE);
      console.log(grid.findLongestRoute(HOVER_NODE.q, HOVER_NODE.r));
    }
  } else {
    if (INTERSECTED_NODE) {
      grid.showHideNode(HOVER_NODE, false);
      grid.showConnections(HOVER_NODE, false);
      grid.hideRecursiveNeighbours(HOVER_NODE.q, HOVER_NODE.r);
    }

    INTERSECTED_NODE = null;
  }
}

document.addEventListener('mousemove', handleMouseEvent);
