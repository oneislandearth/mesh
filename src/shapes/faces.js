// Import the required math functions
import { add, toMeters } from 'utils/math';

// Import the required shape modules
import { Face } from 'shape/face';

// Import the core mesh module
import { Mesh } from 'shapes/mesh';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Faces');

// Define a class for a group of Face classes
export class Faces extends Array {

  // Define the constructor
  constructor(faces, mesh = null) {

    // Throw an error if the mesh in not a Mesh
    if (mesh) validate({ mesh, Mesh });

    // Map each of the faces to a Face
    faces = faces.map(face => new Face(face, mesh));
    
    // Bind the array of faces to the class
    super(...faces);

    // Define the reference to the mesh
    this.mesh = mesh;
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Calculate the sum of area in the faces
  get area() {

    // Calculate the sum of face area
    const value = this.reduce((sum, { area }) => add(sum, area), 0);

    // Return as a unit in meters
    return toMeters(value);
  }
}