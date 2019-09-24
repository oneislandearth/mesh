// Import the required math functions
import { divide, multiply, dot } from 'utils/math';

// Reordered the face indices permutation such that the winding is the same for all faces
export class Facewinder {

  constructor(faces) {

    // Bind all of the faces
    this.faces = faces;

    // Holds a list of the orders / windings for each face
    this.windings = new Array(faces.length);

    // Define the current index
    const index = 0;

    // Define the current face
    const face = this.faces[index];

    // Check if the direction of the face is pointing inwards
    if (divide(multiply(dot(face.a, face.normal), Number(face.area)), 3) < 0) {

      // Flip the direction of the face to point outwards
      face.reverse();
    }

    // Update the face winding for the first face
    this.updateFaceWinding(index, face);
  }

  // Find a index of the face in the faces
  indexOfFace(face) {

    // Iterate through each of the faces
    for (const i in this.faces) {

      // Return the value if the face matches
      if (this.faces[i].equals(face)) return Number(i);
    }
  }

  // Update the face winding on the face
  updateFaceWinding(index, indices) {

    // Reorder the face
    this.faces[index].update(indices);

    // Update the winding flag for the face
    this.windings[index] = true;

    // Order the faces adjacent to the faces
    this.updateAdjacentFaceWinding(index);
  }

  // Update the face winding on the adjacent faces
  updateAdjacentFaceWinding(index) {

    // Extract the current face
    const face = this.faces[index];

    // Extract the adjacent faces
    const adjacentFaces = this.faces[index].adjacentFaces;

    // Iterate through the adjacent face
    for (const i in adjacentFaces) {

      // Skip to the next face if there is no adjacent face (face is in correct order)
      if (!adjacentFaces[i]) continue;

      // Find the index of the adjacent face
      const adjacentIndex = this.indexOfFace(adjacentFaces[i]);

      // Skip to the next face if the face has been ordered / wound
      if (this.windings[adjacentIndex]) continue;

      // Extract the edge fro the current face
      const [i0, i1] = face.edges[i];

      // Iterate through each of the indices on the adjacent face
      for (const i2 of adjacentFaces[i]) {

        // Find the indices which is not part of the edge
        if (i0 != i2 && i1 != i2) {

          // Update the winding order for the adjacent face
          this.updateFaceWinding(adjacentIndex, [i1, i0, i2]);
        }
      }
    }
  }
}