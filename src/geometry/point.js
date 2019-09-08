// Import the required geometry modules
import { Vector } from 'geometry/vector';

// Define a class Point which defines a vector within space
export class Point extends Vector {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Call the super function to bind our coodinates to the array
    super(x, y, z);
  }

  // Cast the point to a Vector
  toVector() {

    // Return a new Vector
    return new Vector([this.x, this.y, this.z]);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}