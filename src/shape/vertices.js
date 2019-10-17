// Import the required math function
import { add, unit } from '@oneisland/math';

// Import the required shape modules
import { Vertex } from 'shape/vertex';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Vertices');

// Define a class for a group of Face classes
export class Vertices extends Array {

  // Define the constructor
  constructor(vertices, mesh = null) {

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

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

  // Compute the vertex normals from the face normals
  computeNormals() {

    // Create an empty list of normals and fill with 0, 0, 0
    const normals = new Array(this.length).fill([0, 0, 0]);

    // Iterate through each of the faces in the mesh
    for (const face of this.mesh.faces) {

      // Add the face normal to the vertex normal
      face.map(index => normals[index] = add(normals[index], face.normal));
    }
    
    // Iterate through each of the vertices
    for (let i = 0; i < this.length; i++) {

      // Add the normal to the vertex
      this[i].updateNormal(unit(normals[i]));
    }
  }
}