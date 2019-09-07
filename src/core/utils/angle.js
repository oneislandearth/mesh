// Import the math functions
import { multiply, divide, pi } from 'utils/math';

// Define a class Angle which describes an angle
export class Angle extends Number {

  // Bind the angle in radians
  constructor(angle) {

    // Check whether the angle is complex number, and select the value in radians
    const radians = ((angle.re) ? angle.re : angle);

    // Call the super function to bind our angle in radians
    super(radians);
  }

  // Define the species to be a Number
  static get [Symbol.species]() {
    return Number; 
  }

  // Get the angle in radians
  get radians() {

    // Return the angle in radians
    return this;
  }

  // Get the angle in degrees
  get degrees() {

    // Return the angle in degrees
    return multiply(this.radians, divide(180, pi));
  }

  // Get the angle as a string in degrees
  toString() {

    // Return the angle in degrees
    return `${this.degrees}°`;
  }
}