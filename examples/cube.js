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
    [0, 1, 2, 3],
    [7, 4, 0, 3],
    [4, 5, 1, 0],
    [6, 7, 3, 2],
    [5, 6, 2, 1],
    [7, 6, 5, 4]
  ]

});

// Log out the area and volume of the mesh
console.log(cube.area, cube.volume);