import dat from "dat";

import Canvas from 'canvas';
import Node   from 'node';
import Grid   from './grid';

const grid   = new Grid();
const canvas = new Canvas();

canvas.scene.add(grid);

const gui = new dat.GUI();
gui.add(grid, 'tileSize', 10, 100).onChange(value => grid.update());
gui.add(grid, 'showWeb').onChange(value => grid.update());