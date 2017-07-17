import Canvas from 'canvas';
import Node   from 'node';

const canvas = new Canvas( 1024, 576, 25 );

const distance = 80;
const width    = 5;
let   count    = 0;

// create array of nodes
function createNodeArray() {
  for (let y = 0; y < width; y++) {

    for (let i = 0; i < width; i++) {
      const node = new Node();
      node.translateX((width - (i % width)) * distance);
      node.translateX(-(distance * 3));
      node.translateZ(distance * y);
      canvas.scene.add( node );
      count++;
    }

    for (let i = 0; i < width + 1; i++) {
      const node = new Node();
      node.translateX((width + 1 - (i % width + 1)) * distance);
      node.translateX(-(distance * 3));
      node.translateX(-(distance / 2));
      node.translateZ(distance / 2);
      node.translateZ(distance * y);
      canvas.scene.add( node );
      count++;
    }
  }
}

// create one node
function createNode() {
  const node = new Node();
  canvas.scene.add( node );
  count++;
}

// createNodeArray();
createNode();

console.log(`Total nodes :: ${count}`);