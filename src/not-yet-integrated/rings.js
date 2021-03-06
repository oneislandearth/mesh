// An updated algorithm that sorts the faces of the dome into vertical rings.

import {dot, cross, divide, subtract, add} from '@oneisland/math';

// A function that checks if a given face has two elements in one list
const faceContainsTwo = (test, two) => {
  // Check if the face (test) has two elements in the given list
  if ((two.includes(test[0]) && two.includes(test[1])) || 
  (two.includes(test[0]) && two.includes(test[2])) || 
  (two.includes(test[2]) && two.includes(test[1]))) {
    return true;
  }
};

// The function that finds an individual ring of the dome, given the vertices that make the bottom of the ring
const findRing = (bottomVertices, faces) => {

  // The variable that will contain all the faces that make up the ring
  const ring = [];

  // The array that will contain the vertices that form the top of the ring.
  const topVertices = [];

  // Iterate through all of the faces
  for (const face of faces) {
    // Check if the face has two vertices that are elements of the bottom vertices array
    if (faceContainsTwo(face, bottomVertices)) {
      ring.push(face);
    }
  }

  // We now need to find all the top points of the ring, ie the top points of each triangle that we've found so far.
  // In other words, for each face we've found, find the point in the face that doesn't belong to bottomVertices.
  for (const fac of ring) {
    for (const vertex of fac) {
      // If the vertex in the face isn't a member of bottomVertices, add it to the top vertices.
      // A vertex can't be in both the bottomVertices and the top, so we shouldn't have cases where
      // the wrong faces are added.
      if (!bottomVertices.includes(vertex)) {
        topVertices.push(vertex);
      }
    }
  }

  // To complete the ring, we need to find those faces that have two vertices in the topVertices array,
  // and one in the bottomVertices array. In other words, we have found all the faces that look
  // like /\/\/\/\/\, and now we need to find the ones in between, the ones that look
  // like  \/\/\/\/\/ to complete the ring.

  // Iterate through all of the faces
  for (const f of faces) {
    // Check if the face has two vertices that are elements of the top vertices array
    if (faceContainsTwo(f, topVertices)) {
      // Check if the face contains 
      for (const vec of f) {
        if (bottomVertices.includes(vec)) {
          ring.push(f);
        }
      }
    }
  }

  return [ring, topVertices];

};

// We need the function to run for the whole dome and stop when it has sorted the whole dome into rings.
// We do this by creating a clone of the dome and loop the findRing function. Everytime we run the rings algorithm 
// we remove that ring from the clones list of faces, ensuring we don't add or search for faces we have already sorted into rings.
// We stop the loop when the size of the clone is zero, or in other words when there are no more faces to sort into rings.

// The array that will contain all the rings that make the dome
const listOfRings = [];

// The array that contains the base points of the dome, which is used to start the findRing function
let bottomArray = baseOfDome;

// Our coppied array of the faces of the dome
const cloneFaces = mesh.faces;

while (cloneFaces.length > 0) {
  // Store the results of the findRing algorithm
  const results = findRing(baseOfDome, cloneFaces);

  // Update the bottom faces, so the new bottom faces are the top of the old ring, meaning with each
  // cycle of the loop we work our way up the dome
  bottomArray = results[1];

  // Add the newly found ring to the listOfRings
  listOfRings.push(results[0]);

  // Remove the faces found in the ring from the cloneFaces array
  for (const el of results[0]) {
    cloneFaces.filter(x => x != el);
  }
}

const middle = (face) => {
  return (divide(add(face[0], face[1], face[2]), 3));
};

// We need to ensure each ring starts from around the same place on the dome. We do this by
// finding which face in the ring has the highest x value for the average of it's points.
let max = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

// A function that moves an element in an array from one position in the array to another
const arraymove = (arr, fromIndex, toIndex) => {
  let element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

// Iterate through all the rings
for (let r of listOfRings) {
  // Iterate through each face of the rings
  for (const i in r) {
    // Checks if the face has a greater average x value than the previous max, and if so updates the max
    if (middle(r[i])[0] > middle(max)[0]) {
      max = r[i];
    }
    // If we have iterated through all of the ring, move the max value to the front of the ring
    const y = parseInt(i, 10);
    if (y == r.length - 1) {
      r = arraymove(r, r.findIndex(max), 0);
    }
  }
}

// Define the centre as the centre of the dome
const centre = [];

// We now need to order each of the rings, which we do using a method from the floor algorithm
for (const r of listOfRings) {
  // Order the faces' centres around their neighbours, after the centre has been projected onto the ground.
  // We project them by averaging the x and z coordinates of the face, and then combining them in an array
  // with 0 for the y vector.
  r.sort((a, b) => ((dot([0, 1, 0], cross(subtract([middle(a)[0], 0, middle(a)[2]], centre), subtract(subtract([middle(b)[0], 0, middle(b)[2]], centre))) > 0) ? 1 : -1)));
}