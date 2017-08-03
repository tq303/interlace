# Interlace

This project is the merging of mesh networks, blockchain and an interactive light display.

## Prerequisites

```sh
sudo apt-get install lus5.2 luarocks libev-dev

luarocks busted // lua test framework

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