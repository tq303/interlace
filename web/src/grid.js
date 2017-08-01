/*
 This has been ported from https://github.com/RobertBrewitz/axial-hexagonal-grid
 with the addition of threejs etc

 It use axial positioning and has useful functions for finding neighbours, p2p distance and conversions
 */

import { Object3D } from 'three';

import Node from 'node';

export default class Grid extends Object3D {
  constructor(options = {}) {
    super();

    this.tileSize    = (options.tileSize)    ? options.tileSize    : 20;
    this.tileSpacing = (options.tileSpacing) ? options.tileSpacing : 0;
    this.pointyTiles = (options.pointyTiles) ? options.pointyTiles : false;

    this.nodes = this.build(0, 0, 5, true);

    console.log(`Total nodes :: ${this.nodes.length}`);
  }

  ring(q, r, radius) {
    const result = []
    const moveDirections = [[1,0], [0,-1], [-1,0], [-1,1], [0,1], [1,0], [1,-1]];

    moveDirections.forEach((moveDirection, moveDirectionIndex) => {
      for (let i = 0; i < radius - 1; i++) {
        q += moveDirection[0];
        r += moveDirection[1];
        if (moveDirectionIndex !== 0) {
          result.push(this.createNode(q, r));
        }
      }
    });

    return result;
  }

  build(q, r, radius, solid) {
    let result = []
    if (solid) {
      result.push(this.createNode(0,0));
    }
    for (let currentRing = 1; currentRing < radius; currentRing++) {
      result.push(...this.ring(q, r, currentRing));
    }
    return result;  
  }

  createNode(q, r) {
    const center = this.getCenterXY(q, r);
    const node = new Node();
    node.translateX(center.x);
    node.translateZ(center.y);
    this.add(node);
    return {
      q,
      r,
      node
    };
  }

  neighbors(q, r) {
    const result = [];
    const neighbors = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
    neighbors.forEach((neighbor) => {
      result.push({ q: q+neighbor[0], r: r+neighbor[1] });
    });
    return result;    
  }

  getCenterXY(q, r) {
    let x,y;
    if (this.pointyTiles) {
      x = (this.tileSize + this.tileSpacing) * Math.sqrt(3) * (q + r / 2)
      y = -((this.tileSize + this.tileSpacing) * 3/2 * r)      
    } else {
      x = (this.tileSize + this.tileSpacing) * 3/2 * q
      y = -((this.tileSize + this.tileSpacing) * Math.sqrt(3) * (r + q / 2))      
    }
    return { x: x, y: y }    
  }

  axialDistance(q1, r1, q2, r2) {
    return (Math.abs(q1-q2) + Math.abs(r1-r2) + Math.abs(q1+r1-q2-r2)) / 2;
  }

  pixelToAxial(x, y) {
    const decimalQR = this.pixelToDecimalQR(x, y);
    const cube = this.axialToCube(decimalQR);
    const roundedCube = this.roundCube(cube);
    this.cubeToAxial(roundedCube);    
  }

  pixelToDecimalQR(x, y, scale) {
    let q,r;
    if (typeof scale !== "number") {
      scale = 1
    }

    if (this.pointyTiles) {
      q = (1/3 * Math.sqrt(3) * x - 1/3 * -y) / (this.tileSize + this.tileSpacing);
      r = 2/3 * -y / (this.tileSize + this.tileSpacing);
    } else {
      q = 2/3 * x / (this.tileSize + this.tileSpacing);
      r = (1/3 * Math.sqrt(3) * -y - 1/3 * x) / (this.tileSize + this.tileSpacing);
    }

    q /= scale
    r /= scale

    return { q: q, r: r };    
  }

  roundCube(coordinates) {
    let rx = Math.round(coordinates.x);
    let ry = Math.round(coordinates.y);
    let rz = Math.round(coordinates.z);

    const dx = Math.abs(rx - coordinates.x);
    const dy = Math.abs(ry - coordinates.y);
    const dz = Math.abs(rz - coordinates.z);

    if (dx > dy && dx > dz) {
      rx = -ry-rz;
    } else if (dy > dz) {
      ry = -rx-rz;
    } else {
      rz = -rx-ry;
    }

    return { x: rx, y: ry, z: rz };    
  }

  cubeToAxial(cube) {
    return { q: cube.x, r: cube.y };
  }

  axialToCube(axial) {
    return { x: axial.q, y: axial.r, z: -axial.q-axial.r };
  }
}