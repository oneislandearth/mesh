// Import the required math functions
import { cos, divide, sin, multiply, subtract, add, dot, cross } from 'utils/math';

// Import the require geometry modules
import { Vector } from 'geometry/vector';

// Import the required geometry utilities
import { Angle } from 'geometry/utils/angle';
import { Direction } from 'geometry/utils/direction';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Quaternion');

// Calculate a Quaternion from a scalar and vector
export class Quaternion extends Array {

  // Create a new Quaternion from the scalar and vector
  constructor({ scalar, vector }) {

    // Throw an error if the scalar is not a Number
    validate({ scalar, Number });

    // Throw an error if the vector is not a Vector
    validate({ vector, Vector });

    // Call the super function to bind our coodinates to the array
    super(scalar, ...vector);
  }

  // Create a new Quaternion from a Vector
  static fromVector({ vector }) {

    // Throw an error if the vector is not a Vector
    validate({ vector, Vector });

    // Return the new Quaternion
    return new Quaternion({ scalar: 0, vector });
  }

  // Create a new Quaternion from a rotaton (angle and axis)
  static fromAngleAndDirection({ angle, direction }) {

    // Throw an error if the angle is not an Angle
    validate({ angle, Angle });

    // Throw an error if the direction is not a Direction
    validate({ direction, Direction });

    // Extract the x, y and z values from the direction
    const [x, y, z] = direction;

    // Return the Quaternion
    return new Quaternion({ 

      // Calculate the scalar
      scalar: cos(divide(angle, 2)), 

      // Calculate the vector
      vector: new Vector([

        // Calculate the x value
        multiply(sin(divide(angle, 2)), x),

        // Calculate the y value
        multiply(sin(divide(angle, 2)), y),

        // Calculate the z value
        multiply(sin(divide(angle, 2)), z)
      ])
    });

  }

  // Multiply two Quaternions using the Hamilton Product
  multiply(quaternion) {

    // This function is non-commutative as cross(v1, v2) != cross(v2, v1)
    // The current (this) quaternion must be the the rotation quaterion
    // The passed (quaternion) quaternion must be the point quaterion

    // Throw an error if the quaternion is not a Quaternion
    if (!(quaternion instanceof Quaternion)) throw new TypeError('Quaternion.multiply expects "quaternion" to be a Quaternion');

    // Extract the scalar and vector values from the quaternions
    const [s1, v1] = [this.scalar, this.vector];
    const [s2, v2] = [quaternion.scalar, quaternion.vector];

    // Return the resulting quaternion from the multiplication
    return new Quaternion({
      
      // Calculate the scalar
      scalar: subtract(multiply(s1, s2), dot(v1, v2)),
      
      // Calculate the vector
      vector: new Vector(add(add(multiply(s1, v2), multiply(s2, v1)), cross(v1, v2)))
    });
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Determine the current scalar of the Quaternion
  get scalar() {

    // Return the scalar
    return this[0];
  }

  // Determine the current vector of the Quaternion
  get vector() {

    // Return the vector
    return new Vector(this[1], this[2], this[3]);
  }
}