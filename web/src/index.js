// @flow

import Canvas from 'canvas';
import Node   from 'node';
import bandDown from './animations/band-dwn';

const canvas  = new Canvas();
const width   = 7;
const length  = 7;
const spacing = 30;

function createNode(x: number, z: number):void {
  const node = new Node();
  node.translateX(x * spacing);
  node.translateZ(z * spacing);
  canvas.scene.add(node);
}

for (let x = -Math.floor(width / 2); x < Math.ceil(width / 2); x++)
  for (let z = -Math.floor(length / 2); z < Math.ceil(length / 2); z++)
    createNode(x, z);
