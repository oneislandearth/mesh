// Import the testing module
import test from 'ava';

// Import the required classes
const { Mesh } = require('lib');

// Values match expected
test('Simple mesh', (result) => {

  // Create mesh
  const mesh = new Mesh({
  
    vertices: [
      [10, 20, 30],
      [10, 20, 30],
      [10, 20, 30]
    ],
  
    faces: [[0, 2, 1]]
  });

  // Results
  result.assert(mesh.vertices.length == 3);
  result.assert(mesh.faces.length == 1);
});