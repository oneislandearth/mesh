// Import the required math functions
import { divide, add, subtract, norm, cross, dot, toMeters } from '@oneisland/math';

// Import the required geometry modules
import { Plane } from 'geometry/plane';
import { Point } from 'geometry/point';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the required shape modules
import { Edge } from 'shape/edge';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Face');

// Define a class face which is an array of three vertices plus extra properties
export class Face extends Array {

  // Bind the indices to the mesh and any mesh
  constructor([a, b, c], mesh = null) {

    // Throw an error if a, b or c is not a Number
    validate({ a, b, c }, 'Number');

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

    // Call the super function to bind our indices
    super(a, b, c);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;
  }

  // Define the species
  get species() {
  
    // Define the species as 'Face'
    return 'Face';
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Find the index of the face in the mesh faces
  get index() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the index - the face is not bound to a Mesh`);

    // Return the index of the face in the faces
    return Number(this.mesh.faces.findIndex(face => face.equals(this)));
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
    const normal = new Direction(cross(subtract(this.b, this.a), subtract(this.c, this.a)));

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
      new Edge([this[0], this[1]], this.mesh), 
      new Edge([this[1], this[2]], this.mesh), 
      new Edge([this[2], this[0]], this.mesh)
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

    // Return the list of adjacent faces
    return [
      
      // Find face at edge ab/ba
      this.findAdjacentFaceFromEdgeIndex(0), 
      
      // Find face at edge bc/cb
      this.findAdjacentFaceFromEdgeIndex(1),

      // Find face at edge ca/ac
      this.findAdjacentFaceFromEdgeIndex(2)
    ];
  }

  // Find an adjacent face from an edge index (0: ab, 1: bc, 2: ca)
  findAdjacentFaceFromEdgeIndex(edgeIndex) {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the adjacent face fom the edge index - the face is not bound to a Mesh`);

    // Determine the vertex which make up the edge
    const i0 = (edgeIndex);
    const i1 = ((edgeIndex + 1) % 3);

    // Determine the vertex which is not part of the edge
    const i2 = ((edgeIndex + 2) % 3);

    // Find the index of the adjacent face
    const faceIndex = this.mesh.faces.findIndex(face => {
      
      // Check that the face contains i0 and i1 (the edge)
      const edgeCheck = (~face.indexOf(this[i0]) && ~face.indexOf(this[i1]));

      // Check that the face doesn't contain the current index (same face)
      const otherCheck = (face.indexOf(this[i2]) == -1);

      // Return true if the face is an adjacent face
      return (edgeCheck && otherCheck);
    });

    // Return null if there is no face / face index, or return the face
    return (~faceIndex) ? this.mesh.faces[faceIndex] : null;
  }

  // Update the indices in the face
  update([a, b, c]) {

    // Throw an error if a is not a Number
    // validate(a, 'Number');

    // Throw an error if b is not a Number
    // validate({ b, Number });

    // Throw an error if c is not a Number
    // validate({ c, Number });

    // Update the indices
    this[0] = a;
    this[1] = b;
    this[2] = c;
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
    validate({ face }, 'Face');

    // Check that the faces equal the same value
    return (this.toString() === face.toString());
  }

  // Evaluate if the face contains a vertex
  contains(vertex) {

    // Throw an error if vertex is not a Vertex
    // validate({ vertex, Vertex });

    // Find the vertex within the face
    const match = this.vertices.filter(v => v.toString() == vertex.toString());

    // Return true if the vertex is in the face
    return Boolean(match);
  }
}