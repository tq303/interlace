// @flow

import Canvas from 'canvas';
import Node   from 'node';
import Grid   from './grid';

const canvas = new Canvas();
canvas.scene.add(new Grid());