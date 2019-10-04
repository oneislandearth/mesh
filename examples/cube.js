// Import the required classes
const { Mesh } = require('../lib');

// Define the size of a cube
const size = 10;

// Scale the size in directions (neg, pos)
const [neg, pos] = [(size / 2), (-size / 2)];

// Create a cube mesh
const cube = new Mesh({
  
  vertices: [
    [neg, neg, pos],
    [pos, neg, pos],
    [pos, neg, neg],
    [neg, neg, neg],
    [neg, pos, pos],
    [pos, pos, pos],
    [pos, pos, neg],
    [neg, pos, neg]
  ],
  
  faces: [
    [2, 3, 0],
    [2, 1, 0],
    [7, 3, 0],
    [0, 4, 7],
    [4, 0, 1],
    [1, 5, 4],
    [6, 2, 3],
    [3, 7, 6],
    [5, 1, 2],
    [2, 6, 5],
    [7, 4, 5],
    [5, 6, 7]
  ]

});

// Log out the area and volume of the mesh
console.log(cube.area, cube.volume);