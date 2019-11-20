// Import the required geometry modules
import { Point } from 'geometry/point';
import { Vector } from 'geometry/vector';

// Import the required utilities
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Vertex');

// Creates a Vertex within a Mesh
export class Vertex extends Point {

  // Create a Vertex from the x, y, z coordinates
  constructor([x, y, z], mesh = null) {

    // Throw an error if the x, y or z value is not a Number
    validate({ x, y, z }, 'Number',);

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

    // Pass the coordianted to the super function
    super([x, y, z]);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;

    // Define the vertex normal
    this.normal = null;
  }

  // Define the species
  get species() {
    
    // Define the species as 'Vertex'
    return 'Vertex';
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Find the index of the vertex in the mesh vertices
  get index() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the index - the vertex is not bound to a Mesh`);

    // Return the index of the vertex in the vertices
    return Number(this.mesh.vertices.findIndex(vertex => vertex.equals(this)));
  }

  // Update the vertex normal
  updateNormal(normal) {

    // Update the normal of the vertex
    this.normal = normal;
  }

  // Cast the Vertex to a Point
  toPoint() {

    // Return a new Point
    return new Point([this.x, this.y, this.z]);
  }

  // Cast the Vertex to a Vector
  toVector() {

    // Return a new Vector
    return new Vector([this.x, this.y, this.z]);
  }

}