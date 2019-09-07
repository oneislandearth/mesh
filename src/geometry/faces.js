// Import the required modules from mathjs
import { divide, add } from 'utils/math';

// Import the required utilities
import { MetricNumber } from 'utils/number';

// Import the required core modules
import { Vector } from 'core/utils/vector';

// Import the required geometric modules
import { Face } from 'geometry/face';

// Define a class for a group of Face classes
export class Faces extends Array {

  // Define the constructor
  constructor({ faces }) {

    // Map each face to a Face
    faces = faces.map(([a, b, c]) => {

      // Determine as to whether vertices or indices
      const key = ((Array.isArray(a)) ? 'vertices' : 'indices');
     
      // Return the face
      return new Face({ [key]: [a, b, c] });
    });

    // Bind the array of faces to the class
    super(...faces);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Determine whether the faces are mapped to vertices or are indices
  get mapped() {
    return this[0].mapped;
  }

  // Get each face from the list of faces
  get faces() {
    return this;
  }

  // Set the faces 
  set faces(faces) {
    this.faces = faces;
  }

  // Get center of all the faces
  get center() {

    // Check if the face is mapped
    if (!this.mapped) throw new Error(`Cannot compute the center of the faces - the faces are not mapped to vertices`);

    // Calculate the center of the faces
    return new Vector(divide(this.faces.reduce((sum, { vertices }) => add(sum, vertices), [0, 0, 0]), this.faces.length));
  }

  // Get the sum of area in the faces
  get area() {

    // Check if the face is mapped
    if (!this.mapped) throw new Error(`Cannot compute the area of the faces - the faces are not mapped to vertices`);

    // Calculate the sum of face area
    const value = this.faces.reduce((sum, { area }) => add(sum, area), 0);

    // Return as a metric number with units
    return new MetricNumber(value);
  }

}