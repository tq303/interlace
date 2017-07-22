// @flow

import Canvas from 'canvas';
import Node   from 'node';

const canvas = new Canvas();

const width = 6;
const height = 6;
const mag = 180;

let count = 0;

function createNode(x: number, y: number) {
  const node = new Node();
  node.translateX(1 / width * x * mag);
  node.translateY(1 / height * y * mag);
  canvas.scene.add( node );
  count++;
}

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    createNode(x, y);
  }
}

console.log(count);