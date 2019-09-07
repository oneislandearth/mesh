// Import the Vector class
import { Vector } from 'core/utils/vector';

// Define a class Point which defines a vector within space
export class Point extends Vector {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Call the super function to bind our coodinates to the array
    super(x, y, z);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}