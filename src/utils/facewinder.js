// Reordered the face indices permutation such that the winding is the same for all faces
export class Facewinder {

  constructor(mesh) {

    // Bind all of the faces
    this.mesh = mesh;

    // Holds a list of the orders / windings for each face
    this.windings = new Array(this.mesh.faces.length);

    // Define the current index
    const index = 0;

    // Define the current face
    const face = this.mesh.faces[index];

    // Update the face winding for the first face
    this.updateFaceWinding(index, face);

    // Check if the direction of the face is pointing inwards
    if (this.mesh.volume < 0) {

      // Reset the list of list of the orders / windings for each face
      this.windings = new Array(this.mesh.faces.length);

      // Flip the direction of the face to point outwards
      face.reverse();

      // Update the face winding for the first face
      this.updateFaceWinding(index, face);
    }
  }

  // Update the face winding on the face
  updateFaceWinding(index, indices) {

    // Return if the face is already would
    if (this.windings[index]) return;

    // Reorder the face
    this.mesh.faces[index].update(indices);

    // Update the winding flag for the face
    this.windings[index] = true;

    // Order the faces adjacent to the faces
    this.updateAdjacentFaceWinding(index);
  }

  // Update the face winding on the adjacent faces
  updateAdjacentFaceWinding(index) {

    // Extract the current face
    const face = this.mesh.faces[index];

    // Extract the adjacent faces
    const adjacentFaces = face.adjacentFaces;

    // Iterate through the adjacent face
    for (const i in adjacentFaces) {

      // Skip to the next face if there is no adjacent face
      if (!adjacentFaces[i]) continue;

      // Find the index of the adjacent face
      const adjacentIndex = adjacentFaces[i].index;

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