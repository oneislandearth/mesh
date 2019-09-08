// Import the required geometry modules
import { Point } from 'geometry/point';

// Creates a Vertex within a Mesh
export class Vertex extends Point {

  // Create a Vertex from the x, y, z coordinates
  constructor([x, y, z]) {

    // Pass the coordianted to the super function
    super(x, y, z);
  }

  // Cast the Vertex to a Vector
  toVector() {

    // Return a new Vector
    return new Vector([this.x, this.y, this.z]);
  }

  // Rotate the Vertex by a Rotation
  rotate(rotation) {

    // Perform the rotation
    // Quaterquaternion

    // Extract the x, y and z values from the rotation
    const [, x, y, z] = Quaternion.toVector();
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }
}
