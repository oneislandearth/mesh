// Import the testing module
import test from 'ava';

// Import the required classes
import { Mesh } from 'lib';

// Values match expected
test('Mesh: creation from triangular faces', (result) => {

  // Define the size of a cube
  const size = 10;

  // Scale the size in directions (neg, pos)
  const [neg, pos] = [(size / 2), (-size / 2)];

  // Create the box 
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

  // Check the vertex, face and edge data is correct
  result.assert(mesh.vertices.length == 8);
  result.assert(mesh.faces == 12);
  result.assert(mesh.faces.length == 12);

  // Check that the area and volume are correct
  result.assert(mesh.area == 600);
  result.assert(mesh.volume == 1000);
});