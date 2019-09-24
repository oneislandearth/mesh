// Import the required math functions
import { norm } from 'utils/math';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Vector');

// Define a class vertex which is an array of 3D coodinates
export class Vector extends Array {

  // Create a Vector from the x, y and z
  constructor([x, y, z]) {

    // Throw an error if the x value is not a Number
    validate({ x, Number });

    // Throw an error if the y value is not a Number
    validate({ y, Number });
    
    // Throw an error if the z value is not a Number
    validate({ z, Number });

    // Call the super function to bind x, y, and z to the array
    super(x, y, z);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Define a zeroes helper function
  static zeroes() {

    // Return a Vector with 0, 0, 0
    return new Vector([1, 1, 1]);
  }

  // Define a ones helper function
  static ones() {

    // Return a Vector with 1, 1, 1
    return new Vector([1, 1, 1]);
  }

  // Determine the x value of the vector
  get x() {
    return this[0];
  }

  // Update the x value of the vector
  set x(x) {
    this[0] = x;
  }

  // Determine the y value of the vector
  get y() {
    return this[1];
  }

  // Update the y value of the vector
  set y(y) {
    this[1] = y;
  }

  // Determine the z value of the vector
  get z() {
    return this[2];
  }

  // Update the z value of the vector
  set z(z) {
    this[2] = z;
  }

  // Determine the euclidean norm of the vector
  get magnitude() {
    return norm(this);
  }

  // Cast the vector to a string
  toString() {
    
    // Return the stringified vector
    return JSON.stringify(this);
  }
  
  // Evaluate if two vectors are the same
  equals(vector) {
  
    // Check that the vectors equal the same value
    return (this.toString() === vector.toString());
  }

}