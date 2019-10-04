// Import the required math functions
import { add, toMeters } from 'utils/math';

// Import the required shape modules
import { Face } from 'shape/face';

// Import the required utilities
import { Facewinder } from 'utils/facewinder';

// Import the triangulator utility
// import { Triangulator } from '@oneisland/triangulator';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Faces');

// Define a class for a group of Face classes
export class Faces extends Array {

  // Define the constructor
  constructor(faces, mesh = null) {

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

    // Iterate through each of the faces
    for (const face of faces) {

      // Check if the face has three points
      if (face.length == 3) {
        
        // Map the current face to a Face and push to the triangulated faces
        mesh.faces.push(new Face(face, mesh));
      
      // Throw an error as triangulation isn't yet supported
      } else {

        // Throw an error
        throw new Error('Face triangulation is not yet supported - faces must only contain three points');

        // // Triangulate the current face
        // const triangulator = new Triangulator(face, mesh);

        // // Map the triangulated faces to Faces and push them to the triangulated faces
        // triangulator.addToMesh(mesh);
      }
    }

    // Bind the triangulated faces to the class
    super(...mesh.faces);

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
    const value = this.reduce((sum, { area }) => add(sum, Number(area)), 0);

    // Return as a unit in meters
    return toMeters(value);
  }

  // Compute the correct face normals
  computeNormals() {

    // Perform facewinding to ensure the faces normals point outwards
    new Facewinder(this.mesh);
  }

  // Cast the faces to a string
  toString() {

    // Return the stringified faces
    return JSON.stringify(this);
  }
}