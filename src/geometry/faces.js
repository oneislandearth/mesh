// Import the required modules from mathjs
import { divide, add } from 'mathjs';

// Import the required utilities
import { MetricNumber } from 'utils/number';

// Import the required core modules
import { Vector } from 'core/utils/vector';

// Import the required geometric modules
import { Face } from 'geometry/face';

// Define a class for a group of Face classes
export class Faces extends Array {

  // Define the conscructor
  constructor({ faces, mapped }) {

    // Bind the array of faces to the class
    super(...faces);

    // Determine whether the faces are mapped to vertices or are indices
    this.mapped = Boolean(mapped);
  }

  // Create an array of Face from an array of face indices
  static fromIndicesArray(faces) {

    // Map each face to a Face
    return new Faces({ 
      faces: faces.map(face => new Face({ indices: face })) 
    });
  }

  // Create an array of Face from an array of face vertices
  static fromVerticesArray(faces) {

    // Map each face to a Face
    return new Faces({
      faces: faces.map(face => new Face({ vertices: face })),
      mapped: false
    });
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
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

  // Map the vertices for all the faces
  mapVertices(vertices) {

    // Iterate through each of the faces
    for (const face of this.faces) {

      // Define the vertices
      face.mapVertices([vertices[face.a], vertices[face.b], vertices[face.c]]);
    }

    // Update the mapped flag
    this.mapped = true;

    // Return the instance
    return this;
  }

}