# Interlace

This project is the merging of mesh networks, blockchain and an interactive light display.

## Prerequisites

```sh
sudo apt-get install lua5.1 luarocks libev-dev

luarocks busted

npm install -g flow-bin webpack
```

## Web

### Development

To run the WebGL project on `http://localhost:8080` run the following from the `./web` directory.

```sh
npm run local
```

## Web

Situated within the `./web` folder there is a WebGL representation of the installation.

The idea is that each _node_ is representing a physical mesh node which has a motion sensor pointing at the ground and six led strips between each of the six fins. The strips will be animated when someone passes underneath them and trigger a chain reaction amongst the nodes, demomstrated by a light display. It is these algorithms that will need to be explored most, allowing for dormant behaviour and reactive.

## TODO's

Currently for the web application there needs to be the following.

- create animations
- further alter the node class to have communciation functionality
- send and recieve basic animation trigger data between nodes
- create mouse over interaction to trigger the animationss

## Node

This is a combination of Lua and C code which powers a nodeMCU board. 

## Build

WS2812B LED @ 50mA full RGB
NodeMCU
  - 18mA deep sleep
  - 80mA when running

## Node Communication

Nodes will default to a silent state, listening out for sensor activity. Once there is something detected, that node will become the master node and will alert all it's neighbours. If nodes recieve information before it's current animation has finished it will cause it to take a random action, affecting it's neightbours differently.

### Master Node
A special state where a single node takes over the whole network. This could be useful for linking points.

### Node freeze
Connection overload could cause nodes to randomly explode out in a direction, or area. This would mean it becomes a master node, but of an area.

### Node breakout
If an area that is being controlled is picking up a lot of sensor data, the master node will have loose control and the animations would calm/pulse.

### Node rejection
A situation whereby the recieving node rejects the request.

### Node excitement level
Each node has an excitement level, which once it hits the threshold can gain a particular state. The animations indicate the level of excitement.

## Maths

### Circumference
C = 2PI * r
const radius = C / (2 * Math.PI);