// Import the required classes
const { phi } = require('./lib/utils/math');
const { Mesh } = require('./lib');

// Define the size of a cube
const size = 10;

// Scale the size in directions (neg, pos)
const [neg, pos] = [(size / 2), (-size / 2)];

// Create the box mesh
const mesh = new Mesh({
  
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

console.log(mesh.faces.area, mesh.volume);

// Mesh two
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

console.log(icosahedron.faces.area, icosahedron.volume);