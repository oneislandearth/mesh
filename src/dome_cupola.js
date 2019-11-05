// Adjusted method for adding a cupola to a dome, this time it preserves the old struts

import {dot, cross, add, subtract, divide, multiply, norm} from 'MathJS';

import {ordersPoints} from 'orders_points.js'


// Method creates a cupola for the dome mesh, adding in extra vertices and edges and
// removing those we no longer need. The height variable denotes how high we raise the cupola
// above each existing point
cupola(height) {
  
  // We first need to find the pentagonal hub on the top of the dome, this will be the 
  // vertex with the largest y value

  // Set highest as 0,0,0 when starting the loop
  let highest = [0, 0, 0];

  // Iterate through all the vertices for the dome, if the vertex is higher than the current highest, update the highest
  for (const vertex of this.vertices) {
    if (vertex[1] > highest[1]) {
      highest = vertex;
    }
  }


  // Find all the points that are have an edge with the highest point
  let originalTop = [];
  for (const e of this.edges) {
    if (e.a == highest) {
      originalTopOutside.push(e.b)
    }
    else if (e.b == highest) {
      originalTopOutside.push(e.a)
    }
  }


  // Order the old vertices around their middle, this gives us the edges of the outside of the original top
  // Edges come from i to i+1
  ordersPoints(originalTop);

  // Add the middle of the top to the original top
  originalTop.push(highest);

  // This array will contain the top of the cupola
  const cupola = [];

  // We find each face that contains two vertices around the edges and one in the middle, 
  // ie the top faces, and use their normal to project each point along the edge out in
  // the normal direction to the face.

  // Iterate through each point in originalTop, except for the middle point, and find
  // the face that contains that point, the next point, and the middle point.
  // Also have a variable called faceN that keeps the last face nornmal, which will
  // be used when adding the centre of the cupola.
  let faceN = [];
  for (const i in originalTop) {
    for (const face of faces) {
      if (face.contains(originalTop[i]) && face.contains(originalTop[(i + 1) % (originalTop.length - 1)]) && face.contains(originalTop[originalTop.length -1])) {
        // Extract the normal from this face (we do the above as the face is already wound and so has the correct, exterior pointing normal)
        // and multiply the height to this direction, adding this vector to the original point of originalTop
        cupola.push(add(originalTop[i], multiply(height, face.normal())));
        faceN = face.normal()
      }
    }
  }

  // We now need to order the cupola, which helps when calculating the faces.
  // This contains the ordered cupola points with the middle at the end (the thing we are pushing)
  // We use some trig to calculate the length up we need to go along the y axis
  let orderedCupola = (ordersPoints(cupola)).push(add(originalTop[originalTop.length - 1], [0, multiply(divide(height, cos(angleBetween(faceN, [0, 1, 0])))), 0]));

  // This contains the ordered originalTop points with the middle at the end
  let orderedOriginal = (ordersPoints(originalTop.slice(0, originalTop.length + 1))).push(originalTop[originalTop.length + 1]);

  // We now need to form faces from the new points. We first combine the two lists, then make the faces from there
  const vertices = [...orderedOriginal, ...orderedCupola];

  let faces = [];

  // We first add the faces around the top of the cupola
  for (const i in vertices) {
    if (i > orderedOriginal.length - 1) {
      faces.push([i, (i + 1) % (vertices.length - 1) + orderedOriginal.length, vertices.length - 1]);
    }
  }

  // We then add the faces that connect the top of the cupola with the originalTop
  for (const j in vertices) {
    while (j < orderedOriginal.length - 1) {
      faces.push([i, (i + 1) % (orderedOriginal.length - 1)], i + orderedOriginal.length);
      faces.push([i + orderedOriginal.length, (i + orderedOriginal.length + 1) % (vertices.length - 1) + orderedOriginal.length, i]);
    }
  }

  return (new Mesh(vertices, faces));
}