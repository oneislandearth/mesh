// Import the required geometry modules
import { Point } from 'geometry/point';
import { Vector } from 'geometry/vector';

// Import the required geometry utilities
import { Quaternion } from 'geometry/utils/quaternion';

// Import the required utilities
import { Validator } from '@oneisland/validator';

// Import the required utilities
import { multiply } from '@oneisland/math';

// Define a validator for the class
const { validate } = new Validator('Vertex');

// Creates a Vertex within a Mesh
export class Vertex extends Point {

  // Create a Vertex from the x, y, z coordinates
  constructor([x, y, z], mesh = null) {

    // Throw an error if the x, y or z value is not a Number
    validate({ x, y, z }, 'Number');

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

    // Pass the coordianted to the super function
    super([x, y, z]);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;
  }

  // Define the species
  get species() {
    
    // Define the species as 'Vertex'
    return 'Vertex';
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // // Rotate the point by an angle and direction

  rotate({ angle, direction }) {

    // Throw an error if the angle is not an Angle
    validate({ angle }, 'Angle');

    // Throw an error if the direction is not a Direction
    validate({ direction }, 'Direction');

    // Create a Quaternion from the angle and direction
    const rotationQuaterion = Quaternion.fromAngleAndDirection({ angle, direction });

    // Finds the negative of the direction

    const negdirec = multiply(-1, direction);

    // Create the inverse of the rotation quaternion
    const inverseRotationQuaterion = Quaternion.fromAngleAndDirection({ angle, negdirec });

    // Rotate the vector
    const { vector } = (rotationQuaterion.multiply(this.quaternion)).multiply(inverseRotationQuaterion);

    // Return the rotated vector
    return new Vector(vector);
  }

  // Cast the Vertex to a Point
  toPoint() {

    // Return a new Point
    return new Point([this.x, this.y, this.z]);
  }

  // Cast the Vertex to a Vector
  toVector() {

    // Return a new Vector
    return new Vector([this.x, this.y, this.z]);
  }

}