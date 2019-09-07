import { Faces } from 'geometry/faces';


export class Mesh {

  constructor({ vertices, faces }) {

    // Bind the vertices and faces of the mesh
    this.vertices = Vertices.fromArray(vertices);
    this.faces = Faces.fromIndices(faces);

  }

  // Map the faces to the vertices
  mapFaces() {

    // Return if already mapped
    if (this.faces.mapped) return;

    // Iterate through each of the faces
    for (const face of this.faces) {

      // Fetch the vertex based on indices
      const vertex = (i) => this.vertices[i];

      // Define the vertices
      face.mapVertices([vertex(face.a), vertex(face.b), vertex(face.c)]);
    }
  }

  subtract(mesh) {

  }
}