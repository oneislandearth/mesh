// Import the required math functions
import { add, divide, multiply, dot } from 'utils/math';

// Import the required geometry modules
import { Point } from 'geometry/point';

// Import the required shape modules
import { Vertices } from 'shape/vertices';
import { Faces } from 'shape/faces';

// Create a new mesh from vertices and faces (indices)
export class Mesh {

  constructor({ vertices, faces }) {

    // Bind the vertices to the mesh
    this.vertices = new Vertices(vertices, this);

    // Bind the faces to the mesh
    this.faces = new Faces(faces, this);

    // Compute the correct face normals
    this.faces.computeNormals();
  }

  // Compute the edges of the face
  get edges() {

    // Define the list of edges
    let edges = [];

    // Iterate through each of the faces
    for (const face of this.faces) {

      // Add the values to the edges as a set (removing duplicates)
      edges = [...new Set([...edges, ...face.edges])];
    }

    // Return the list of edges
    return edges;
  }

  // Calculate the center point of the mesh
  get center() {

    // Calculate the center of all vertices
    const point = divide(this.vertices.reduce((sum, { vertices }) => add(sum, vertices), [0, 0, 0]), this.vertices.length);

    // Return the center point
    return new Point(point);
  }

  // Calculate the area of the mesh
  get area() {

    // Return the area of the mesh
    return this.faces.area;
  }

  // Calculate the volume of the mesh
  get volume() {

    // Return the volume of the mesh
    return divide(this.faces.reduce((sum, face) => add(sum, multiply(dot(face.a, face.normal), Number(face.area))), 0), 3);
  }

  // Subtract(mesh) {

  // }

  // Cast the mesh to a string
  toString() {

    // Return the stringified data on the mesh
    return JSON.stringify({
      vertices: this.vertices,
      faces: this.faces
    });
  }
}