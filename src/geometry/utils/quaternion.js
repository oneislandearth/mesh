// Import the required math functions
import { cos, divide, sin, multiply, subtract, add, dot, cross, unaryMinus } from '@oneisland/math';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate, validateArray } = new Validator('Quaternion');

// Calculate a Quaternion from a scalar and vector
export class Quaternion extends Array {

  // Create a new Quaternion from the scalar and vector
  constructor({ scalar, vector }) {

    // Throw an error if the scalar is not a Number
    validate({ scalar }, 'Number');

    // Throw an error if the values in vector are not Number
    validateArray({ vector }, 'Number');

    // Call the super function to bind our coodinates to the array
    super(scalar, ...vector);
  }

  // Define the species
  get species() {
  
    // Define the species as 'Quaternion'
    return 'Quaternion';
  }

  // Create a new Quaternion from a Vector
  static fromVector({ vector }) {

    // Throw an error if the values in vector are not Number
    validateArray({ vector }, 'Number');

    // Return the new Quaternion
    return new Quaternion({ scalar: 0, vector });
  }

  // Create a new Quaternion from a rotaton (angle and axis)
  static fromAngleAndDirection({ angle, direction }) {

    // Throw an error if the angle is not an Angle
    validate({ angle }, 'Angle');

    // Throw an error if the direction is not a Direction
    validate({ direction }, 'Direction');

    // Extract the x, y and z values from the direction
    const [x, y, z] = direction;

    // Return the Quaternion
    return new Quaternion({ 

      // Calculate the scalar
      scalar: cos(divide(angle.radians, 2)), 

      // Calculate the vector
      vector: [

        // Calculate the x value
        multiply(sin(divide(angle.radians, 2)), x),

        // Calculate the y value
        multiply(sin(divide(angle.radians, 2)), y),

        // Calculate the z value
        multiply(sin(divide(angle.radians, 2)), z)
      ]
    });

  }

  // Multiply two Quaternions using the Hamilton Product
  multiply(quaternion) {

    // This function is non-commutative as cross(v1, v2) != cross(v2, v1)
    // The current (this) quaternion must be the the rotation quaterion
    // The passed (quaternion) quaternion must be the point quaterion

    // Throw an error if the quaternion is not a Quaternion
    validate({ quaternion }, 'Quaternion');

    // Extract the scalar and vector values from the quaternions
    const [s1, v1] = [this.scalar, this.vector];
    const [s2, v2] = [quaternion.scalar, quaternion.vector];

    // Return the resulting quaternion from the multiplication
    return new Quaternion({
      
      // Calculate the scalar
      scalar: subtract(multiply(s1, s2), dot(v1, v2)),
      
      // Calculate the vector
      vector: add(add(multiply(s1, v2), multiply(s2, v1)), cross(v1, v2))
    });
  }

  // Rotate a point quaternion by the rotation quaternion
  rotate(rotationQuaternion) {

    // Throw an error if the rotationQuaternion is not a Quaternion
    validate({ rotationQuaternion }, 'Quaternion');
    
    // Create the inverse of the rotation quaternion
    const inverseRotationQuaterion = new Quaternion({ scalar: rotationQuaternion.scalar, vector: unaryMinus(rotationQuaternion.vector) });

    // Perform the first multiplication with the rotation quaternion
    const multipliedQuaternion = rotationQuaternion.multiply(this);

    // Return the rotated quaternion
    return multipliedQuaternion.multiply(inverseRotationQuaterion);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Determine the current scalar of the Quaternion
  get scalar() {

    // Return the scalar part of the quaternion
    return this[0];
  }

  // Determine the current vector of the Quaternion
  get vector() {

    // Return the vector part of the quaternion
    return [this[1], this[2], this[3]];
  }
}