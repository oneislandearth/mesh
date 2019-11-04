// Adds a cupola to a dome mesh

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

  // Add the middle of the top to the original top
  originalTop.push(highest)

  // This array will contain the top of the cupola
  const cupola = [];

  // Takes each point of the original top outside hub and creates a new one above the original, at a distance of height above it
  for (const vertex of originalTop) {
    cupola.push(add(vertex, [0, height, 0]));
  }

  // Adds the new cupola vertices to the global list of vertices
  for (const vertex of cupola) {
    this.vertices.push(new Vertex = vertex);
  }

  // We now need to order the cupola and originalTop vertices clockwise around the y axis, which helps with making 
  // the new faces.

  // This contains the ordered cupola points with the middle at the end
  let orderedCupola = (ordersPoints(cupola.slice(0, cupola.length + 1))).push(cupola[cupola.length + 1]);

  // This contains the ordered originalTop points with the middle at the end
  let orderedOriginal = (ordersPoints(originalTop.slice(0, originalTop.length + 1))).push(originalTop[originalTop.length + 1]);

  // We now need to form faces from the new points

  // We first add the faces around the top of the cupola
  for (const i in orderedCupola) {
    if (i < orderedCupola.length - 1) {
      this.faces.push(new Face = [orderedCupola[i], orderedCupola[(i + 1) % (orderedCupola.length - 1)], orderedCupola[orderedCupola.length - 1]]);
    }
  }

  // We then add the faces that connect the top of the cupola with the originalTop
  for (const j in orderedCupola) {
    if (j < orderedCupola.length - 1) {
      this.faces.push(new Face = [orderedCupola[i], orderedCupola[(i + 1) % (orderedCupola.length - 1)], orderedOriginal[i]]);
      this.faces.push(new Face = [orderedOriginal[i], orderedOriginal[(i + 1) % (orderedOriginal.length - 1)], orderedCupola[i]]);
    }
  }

  // We then remove any faces with the original top of our dome as a vertex, and then delete the original top point from the list
  this.faces.filter(fac => !fac.contains(originalTop[originalTop.length + 1]));

  this.vertices.filter(vec => vec != originalTop[originalTop.length + 1])

}