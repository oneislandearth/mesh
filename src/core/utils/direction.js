// Import the math functions
import { unit } from 'utils/math';

// Import the Vector class
import { Vector } from 'core/utils/vector';

// Define a class Direction which defines a vector within a vector field
export class Direction extends Vector {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Apply the unitizing function
    [x, y, z] = unit([x, y, z]);

    // Call the super function to bind our coodinates to the array
    super(x, y, z);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}