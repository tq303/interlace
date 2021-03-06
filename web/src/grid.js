/*
 This has been ported from https://github.com/RobertBrewitz/axial-hexagonal-grid
 with the addition of threejs etc

 It use axial positioning and has useful functions for finding neighbours, p2p distance and conversions
 */

import { Object3D, Vector3, Geometry, LineDashedMaterial, Line } from 'three';

import { spinner as Node } from 'node';

export default class Grid extends Object3D {
  constructor(options = {}) {
    super();

    this.tileSize = options.tileSize ? options.tileSize : 20;
    this.tileSpacing = options.tileSpacing ? options.tileSpacing : 0;
    this.pointyTiles = options.pointyTiles ? options.pointyTiles : false;
    this.showWeb = options.showWeb ? options.showWeb : false;
    this.showNeighbours = options.showNeighbours ? options.showNeighbours : false;
    this.animateRecursive = options.animateRecursive ? options.animateRecursive : true;
    this.showLongestRoute = options.showLongestRoute ? options.showLongestRoute : true;

    this.nodes = this.build(0, 0, 2);
    this.connectNodes();

    this.showAllConnection();

    console.log(`Total nodes :: ${this.nodes.length}`);
  }

  ring(q, r, radius) {
    const result = [];
    const moveDirections = [[1, 0], [0, -1], [-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1]];

    moveDirections.forEach((moveDirection, moveDirectionIndex) => {
      for (let i = 0; i <= radius; i++) {
        q += moveDirection[0];
        r += moveDirection[1];
        if (moveDirectionIndex !== 0) {
          result.push(this.createNode(q, r));
        }
      }
    });

    return result;
  }

  build(q, r, radius, solid = true) {
    let result = [];
    if (solid) {
      result.push(this.createNode(0, 0));
    }
    for (let currentRing = 0; currentRing < radius; currentRing++) {
      result.push(...this.ring(q, r, currentRing));
    }
    return result;
  }

  connectNodes() {
    this.nodes = this.nodes.map(node => {
      const { q, r } = node;
      const connections = [];

      this.findPotentialNeighbours(q, r).forEach(dest => {
        const potential = this.findNode(dest.q, dest.r);

        if (potential) {
          const center = this.getCenterXY(q, r);
          const geometry = new Geometry();
          const d_center = this.getCenterXY(dest.q, dest.r);
          geometry.vertices.push(new Vector3(center.x, 0, center.y));
          geometry.vertices.push(new Vector3(d_center.x, 0, d_center.y));
          geometry.computeLineDistances();
          const line = new Line(geometry, Grid.LineMaterialShow);
          connections.push({
            line,
            q: dest.q,
            r: dest.r,
          });
          this.add(line);
        }
      });

      return {
        ...node,
        connections,
      };
    });
  }

  createNode(q, r) {
    const center = this.getCenterXY(q, r);

    const node = new Node();
    node.position.x = center.x;
    node.position.z = center.y;
    this.add(node);

    return {
      q,
      r,
      node,
    };
  }

  neighbourOptions() {
    return [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  }

  findPotentialNeighbours(q, r) {
    const result = [];
    const neighbours = this.neighbourOptions();
    neighbours.forEach(neighbour => {
      result.push({
        q: q + neighbour[0],
        r: r + neighbour[1],
      });
    });
    return result;
  }

  findNode(q, r) {
    return this.nodes.find(node => node.q === q && node.r === r);
  }

  findLongestRoute(q, r, show = true) {
    const neighbours = this.neighbourOptions();

    const longest = neighbours
      .map(neighbour => {
        return this.resursiveLookup(q, r, neighbour);
      })
      .map((route, i) => {
        // animate
        if (this.animateRecursive) {
          route.nodeList.forEach(node => {
            setTimeout(() => {
              this.showHideNode(node, show, 0x0e8200);
            }, 50 * route.routeLength);
          });
        }

        return route;
      })
      .sort((a, b) => (a.routeLength > b.routeLength ? -1 : 1))[0];

    // indicate route
    if (this.showLongestRoute) {
      setTimeout(() => {
        longest.nodeList.forEach(node => {
          this.showHideNode(node, show, 0xb14800);
        });
      }, 50 * longest.routeLength + 1);
    }

    return longest;
  }

  showHideNode(node, show = true, colour = 0x500b82) {
    if (node && show) {
      node.node.box.material.color.setHex(colour);
    } else if (node && !show) {
      node.node.box.material.color.setHex(0x000000);
    }
  }

  hideAllNodes() {
    this.nodes.forEach(node => {
      node.node.box.material.color.setHex(0x000000);
    });
  }

  hideRecursiveNeighbours(q, r) {
    this.findLongestRoute(q, r, false);
  }

  resursiveLookup(q, r, neighbour, route = null) {
    if (route === null) {
      route = {
        routeLength: 0,
        nodeList: [],
        neighbour,
      };
    }

    const next = {
      q: q + neighbour[0],
      r: r + neighbour[1],
    };

    const node = this.findNode(next.q, next.r);

    if (node) {
      route.nodeList.push(node);
      route.routeLength += 1;
      return this.resursiveLookup(next.q, next.r, neighbour, route);
    }
    this;

    return route;
  }

  showConnections(node, show = true) {
    if (node && this.showNeighbours && !this.showWeb) {
      node.connections.forEach(link => {
        link.line.material = this.showHideLineMaterial(show);
      });
    }
  }

  showAllConnection() {
    this.nodes.forEach(({ q, r, node, connections }) => {
      connections.forEach(link => {
        link.line.material = this.showHideLineMaterial(this.showWeb);
      });
    });
  }

  updateNodePositions() {
    this.nodes.forEach(({ q, r, node, connections }) => {
      const center = this.getCenterXY(q, r);
      node.position.x = center.x;
      node.position.z = center.y;

      connections.forEach(link => {
        const { geometry } = link.line;
        const d_center = this.getCenterXY(link.q, link.r);
        geometry.vertices[0] = new Vector3(center.x, 0, center.y);
        geometry.vertices[1] = new Vector3(d_center.x, 0, d_center.y);
        geometry.computeLineDistances();
        link.line.material = this.showHideLineMaterial(this.showWeb);
        geometry.verticesNeedUpdate = true;
      });
    });
  }

  showHideLineMaterial(show = true) {
    return show ? Grid.LineMaterialShow : Grid.LineMaterialHide;
  }

  getCenterXY(q, r) {
    let x, y;
    if (this.pointyTiles) {
      x = (this.tileSize + this.tileSpacing) * Math.sqrt(3) * (q + r / 2);
      y = -((this.tileSize + this.tileSpacing) * 3 / 2 * r);
    } else {
      x = (this.tileSize + this.tileSpacing) * 3 / 2 * q;
      y = -((this.tileSize + this.tileSpacing) * Math.sqrt(3) * (r + q / 2));
    }
    return { x: x, y: y };
  }

  axialDistance(q1, r1, q2, r2) {
    return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs(q1 + r1 - q2 - r2)) / 2;
  }

  pixelToAxial(x, y) {
    const decimalQR = this.pixelToDecimalQR(x, y);
    const cube = this.axialToCube(decimalQR);
    const roundedCube = this.roundCube(cube);
    this.cubeToAxial(roundedCube);
  }

  pixelToDecimalQR(x, y, scale = 1) {
    let q, r;

    if (this.pointyTiles) {
      q = (1 / 3 * Math.sqrt(3) * x - 1 / 3 * -y) / (this.tileSize + this.tileSpacing);
      r = 2 / 3 * -y / (this.tileSize + this.tileSpacing);
    } else {
      q = 2 / 3 * x / (this.tileSize + this.tileSpacing);
      r = (1 / 3 * Math.sqrt(3) * -y - 1 / 3 * x) / (this.tileSize + this.tileSpacing);
    }

    q /= scale;
    r /= scale;

    return { q, r };
  }

  roundCube(coordinates) {
    let rx = Math.round(coordinates.x);
    let ry = Math.round(coordinates.y);
    let rz = Math.round(coordinates.z);

    const dx = Math.abs(rx - coordinates.x);
    const dy = Math.abs(ry - coordinates.y);
    const dz = Math.abs(rz - coordinates.z);

    if (dx > dy && dx > dz) {
      rx = -ry - rz;
    } else if (dy > dz) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { x: rx, y: ry, z: rz };
  }

  cubeToAxial(cube) {
    return { q: cube.x, r: cube.y };
  }

  axialToCube(axial) {
    return { x: axial.q, y: axial.r, z: -axial.q - axial.r };
  }
}

Grid.LineMaterialShow = new LineDashedMaterial({
  color: 0x0de5ff,
  dashSize: 2.5,
  gapSize: 5,
});

Grid.LineMaterialHide = new LineDashedMaterial({
  color: 0x000000,
  dashSize: 2.5,
  gapSize: 5,
});
