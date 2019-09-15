// Import the required math functions
import { unit } from 'utils/math';

// Import the Vector class
import { Vector } from 'geometry/vector';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Direction');

// Define a class Direction which defines a vector within a vector field
export class Direction extends Vector {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Throw an error if the x value is not a Number
    validate({ x, Number });

    // Throw an error if the y value is not a Number
    validate({ y, Number });
    
    // Throw an error if the z value is not a Number
    validate({ z, Number });

    // Apply the unitizing function
    [x, y, z] = unit([x, y, z]);

    // Call the super function to bind our coodinates to the array
    super([x, y, z]);
  }

  // Create a new Direction pointing towards the center
  static center() {

    // Return a Direction pointing towards the center
    return new Direction([0, 0, 0]);
  }

  // Create a new Direction pointing towards the right
  static right() {

    // Return a Direction pointing towards the right
    return new Direction([1, 0, 0]);
  }

  // Create a new Direction pointing towards the left
  static left() {

    // Return a Direction pointing towards the left
    return new Direction([-1, 0, 0]);
  }

  // Create a new Direction pointing towards the sky
  static up() {

    // Return a Direction pointing towards the sky
    return new Direction([0, 1, 0]);
  }

  // Create a new Direction pointing towards the ground
  static down() {

    // Return a Direction pointing towards the ground
    return new Direction([0, -1, 0]);
  }

  // Create a new Direction pointing forwards
  static forwards() {

    // Return a Direction pointing forwards
    return new Direction([1, 0, 0]);
  }

  // Create a new Direction pointing backwards
  static backwards() {

    // Return a Direction pointing backwards
    return new Direction([-1, 0, 0]);
  }

  // Create a new Direction from an axis
  static fromAxis(axis) {

    // Cast the axis to lowercase
    axis = String(axis).toLowerCase();

    // Define the axies
    const axies = ['x', 'y', 'z'];

    // Throw an error if the axis is not x, y or z
    if (axies.indexOf(axis) == -1) throw new TypeError('Direction.fromAxis expects "axis" to be a "x", "y" or "z"');

    // Define the default values [x, y, z]
    const direction = [0, 0, 0];

    // Set the axis value to one
    direction[axies.indexOf(axis)] = 1;

    // Return a Direction pointing towards the axis
    return new Direction(direction);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}