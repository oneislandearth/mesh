// Import the required math functions
import { add, toMeters } from 'utils/math';

// Import the required shape modules
import { Face } from 'shape/face';

// Import the required shape utilities
import { Triangulator } from 'shape/utils/triangulator';
// Import { Facewinder } from 'shape/utils/facewinder';

// Import the core mesh module
import { Mesh } from 'mesh/mesh';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Faces');

// Define a class for a group of Face classes
export class Faces extends Array {

  // Define the constructor
  constructor(faces, mesh = null) {

    // Throw an error if the mesh in not a Mesh
    validate({ mesh, Mesh });

    // Iterate through each of the faces
    for (const i in faces) {

      // Extract the current face
      const face = faces[i];

      // Check if the face has three points
      if (face.length == 3) {
        
        // Map the current face to a Face
        faces.splice(i, 1, new Face(face, mesh));

        // Skip to the next face
        continue;
      }

      // Extract the sub faces from the triangulator
      const { splitFaces } = new Triangulator({

        // Add the indices of the face
        indices: face,

        // Add the vertices of the face
        vertices: face.map(vertex => mesh.vertices[vertex])
      });

      // Map the new Faces from the sub faces
      faces.splice(i, 1, splitFaces.map(face => new Face(face, mesh)));
    }

    // Flatten the ffaces
    faces = faces.flat();

    // Wind the faces in the correct order (all inwards or outwards)
    // ({ faces } = new Facewinder(faces));

    // Bind the array to the class
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