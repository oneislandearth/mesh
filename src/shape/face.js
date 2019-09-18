// Import the required math functions
import { divide, add, subtract, norm, cross, minus, dot, toMeters } from 'utils/math';

// Import the required geometry modules
import { Plane } from 'geometry/plane';
import { Point } from 'geometry/point';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the required shape modules
import { Edge } from 'shape/edge';
import { Vertex } from 'shape/vertex';

// Import the core mesh module
import { Mesh } from 'mesh/mesh';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Face');

// Define a class face which is an array of three vertices plus extra properties
export class Face extends Array {

  // Bind the indices to the mesh and any mesh
  constructor([a, b, c], mesh = null) {

    // Throw an error if a is not a Number
    validate({ a, Number });

    // Throw an error if b is not a Number
    validate({ b, Number });

    // Throw an error if c is not a Number
    validate({ c, Number });

    // Throw an error if the mesh in not a Mesh
    if (mesh) validate({ mesh, Mesh });

    // Call the super function to bind our indices
    super([a, b, c]);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Compute the value of vertex a
  get a() {
    return this.vertices[0];
  }

  // Compute the value of vertex b
  get b() {
    return this.vertices[1];
  }

  // Compute the value of vertex c
  get c() {
    return this.vertices[2];
  }

  // Find the vertices for the face based on the indices
  get vertices() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the vertices - the face is not bound to a Mesh`);

    // Return the vertices based on the indices
    return [
      this.mesh.vertices[this[0]], 
      this.mesh.vertices[this[1]], 
      this.mesh.vertices[this[2]]
    ];  
  }

  // Find the Plane from a face
  get plane() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face plane - the face is not bound to a Mesh`);

    // Calculate the normal of the Plane
    const normal = new Direction(cross(minus(this.b, this.a), minus(this.c, this.a)));

    // Calculate the scalar of the Plane
    const scalar = dot(normal, this.a);

    // Return the Plane from the Face
    return new Plane({ normal, scalar });
  }

  // Compute the normal of the face
  get normal() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the normal of the face - the face is not bound to a Mesh`);

    // Return the normal for the face
    return this.plane.normal;
  }  

  // Find the edges from the face
  get edges() {

    // Return the edges in the face (ab, bc, ca)
    return [
      new Edge([this.a, this.b], this.mesh), 
      new Edge([this.b, this.c], this.mesh), 
      new Edge([this.c, this.a], this.mesh)
    ];
  }

  // Compute the center of a face
  get center() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face center - the face is not bound to a Mesh`);

    // Calculate the center of the face
    return new Point(divide(add(this.a, this.b, this.c), 3));
  }

  // Compute the area of a mesh
  get area() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face area - the face is not bound to a Mesh`);
  
    // Calculate the area of a triangle = norm(cross product(a-b, a-c))
    return toMeters(divide(norm(cross(subtract(this.a, this.b), subtract(this.a, this.c))), 2));
  }

  // Find the adjacent faces to the face
  get adjacentFaces() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the adjacent faces - the face is not bound to a Mesh`);

    // Define a list of adjacent faces (ab, cb, ca)
    const adjacentFaces = [null, null, null];

    // Extract the edges from the current face
    const [edgeAB, edgeBC, edgeCA] = this.edges;

    // Find the faces which are shared
    for (const face of this.mesh.faces) {

      // Find the adjacent edge between the face if possible
      const adjacentEdge = this.adjacentFaces(face);

      // Skip to the next face if there is no adjacent edge
      if (!adjacentEdge) continue;

      // Check if the face shares edge a-b and add add this face to the adjacent faces
      if (adjacentEdge.equals(edgeAB)) adjacentFaces[0] = face;

      // Check if the face shares edge b-c and add add this face to the adjacent faces
      if (adjacentEdge.equals(edgeBC)) adjacentFaces[1] = face;

      // Check if the face shares edge c-a and add add this face to the adjacent faces
      if (adjacentEdge.equals(edgeCA)) adjacentFaces[2] = face;
    }

    // Return the adjacent faces
    return adjacentFaces;
  }

  // Find the adjacent edge from a face
  adjacentEdge(face) {

    // Throw an error if face is not a Face
    validate({ face, Face });

    // Extract the edges from the current face
    const [edgeAB, edgeBC, edgeCA] = this.edges;

    // Iterate through all of the edges on the adjacent face
    for (const edge of face.edges) {

      // Check if the edge matches one of the edges (a-b, b-c, c-a) and return the edge
      if (edge.equals(edgeAB) || edge.equals(edgeBC) || edge.equals(edgeCA)) return edge;
    }

    // Return null as there is no adjacent edge
    return null;
  }

  // Reorder the indices in the face
  reorder(order) {

    // Define the validation function to check the face is valid
    const equals = (order) => {

      // Define a sum of indexes
      let sum = 0;

      // Define the valid options (0, 1, 2)
      const valid = [0, 1, 2];

      // Iterate through each of the points in the order
      for (const value of order) {

        // Add the value to the sum
        sum += valid.indexOf(Number(value));
      }
      
      // Return true if there is a 0, 1 and a 2
      return (sum == 3);
    };

    // Throw an error if the order is not valid
    validate({ order, equals, expects: '"order" to be a valid order of indices (0, 1, 2)' });

    console.log(order);

    // Change the order of the faces
    this[0] = this[order[0]];
    this[1] = this[order[1]];
    this[2] = this[order[2]];
  }

  // Flip the current face
  flip() {

    // Switch the order from a, b, c to c, b, a
    this[0] = this[2];
    this[2] = this[0];

    // Flip the plane
    this.plane.flip();
  }

  // Cast the face to a string
  toString() {
    
    // Return the stringified face
    return JSON.stringify(this);
  }

  // Evaluate if two faces are the same
  equals(face) {

    // Throw an error if face is not a Face
    validate({ face, Face });

    // Check that the faces equal the same value
    return (this.toString() === face.toString());
  }

  // Evaluate if the face contains a vertex
  contains(vertex) {

    // Throw an error if vertex is not a Vertex
    validate({ vertex, Vertex });

    // Find the vertex within the face
    const match = this.vertices.filter(v => v.toString() == vertex.toString());

    // Return true if the vertex is in the face
    return Boolean(match);
  }
}