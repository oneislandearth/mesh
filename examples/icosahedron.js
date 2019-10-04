// Import the required classes
const { phi } = require('@oneisland/math');
const { Mesh } = require('../lib');

// Create an icosahedron mesh
const icosahedron = new Mesh({

  vertices: [
    [0, 1, phi], [0, -1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, 1], [-phi, 0, 1], [-phi, 0, -1], [phi, 0, -1],
    [1, phi, 0], [-1, phi, 0], [-1, -phi, 0], [1, -phi, 0] 
  ],

  faces: [
    [0, 8, 9],
    [0, 9, 5],
    [0, 5, 1],
    [0, 1, 4],
    [0, 4, 8],
    [1, 5, 10],
    [1, 10, 11],
    [1, 11, 4],
    [2, 3, 7],
    [2, 7, 11],
    [2, 11, 10],
    [2, 10, 6],
    [2, 6, 3],
    [3, 6, 9],
    [3, 9, 8],
    [3, 8, 7],
    [4, 11, 7],
    [4, 7, 8],
    [5, 9, 6],
    [5, 6, 10]
  ]
});

// Log out the area and volume of the mesh
console.log(icosahedron.area, icosahedron.volume);