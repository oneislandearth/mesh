// Import the required shape modules
import { Vertex } from 'shape/vertex';

// Import the core mesh module
import { Mesh } from 'mesh/mesh';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Vertices');

// Define a class for a group of Face classes
export class Vertices extends Array {

  // Define the constructor
  constructor(vertices, mesh = null) {

    // Throw an error if the mesh in not a Mesh
    validate({ mesh, Mesh });

    // Map each of the vertices to a Vertex
    vertices = vertices.map(vertex => new Vertex(vertex, mesh));
    
    // Bind the array of vertices to the class
    super(...vertices);

    // Define the reference to the mesh
    this.mesh = mesh;
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}