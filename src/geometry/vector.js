// Import the required functions from math
import { norm } from 'utils/math';

// Define a class vertex which is an array of 3D coodinates
export class Vector extends Array {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Call the super function to bind our coodinates to the array
    super(x, y, z);
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

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Get the value of the 'x' coordinate
  get x() {
    return this[0];
  }

  // Set the value of the 'x' coordinate
  set x(x) {
    this[0] = x;
  }

  // Get the value of the 'y' coordinate
  get y() {
    return this[1];
  }

  // Set the value of the 'y' coordinate
  set y(y) {
    this[1] = y;
  }

  // Get the value of the 'z' coordinate
  get z() {
    return this[2];
  }

  // Set the value of the 'z' coordinate
  set z(z) {
    this[2] = z;
  }

  // Get the euclidean norm of the vector
  get magnitude() {
    return norm(this);
  }

}