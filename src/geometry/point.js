// Import the required math functions
import { acos, divide, dot, multiply, norm } from 'utils/math';

// Import the required geometry modules
import { Vector } from 'geometry/vector';

// Import the required geometry utiliites
import { Angle } from 'geometry/utils/angle';
import { Direction } from 'geometry/utils/direction';
import { Quaternion } from 'geometry/utils/quaternion';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Point');

// Define a class Point which defines a vector within space
export class Point extends Vector {

  // Bind the x, y and z coordinates
  constructor([x, y, z]) {

    // Throw an error if the x value is not a Number
    validate({ x, Number });

    // Throw an error if the y value is not a Number
    validate({ y, Number });
    
    // Throw an error if the z value is not a Number
    validate({ z, Number });

    // Call the super function to bind our coodinates to the array
    super([x, y, z]);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Rotate the point by an angle and direction
  rotate({ angle, direction }) {

    // Throw an error if the angle is not an Angle
    validate({ angle, Angle });

    // Throw an error if the direction is not a Direction
    validate({ direction, Direction });

    // Cast the current point into a vector
    let vector = this.toVector();

    // Create a quaternion from the vector
    const vectorQuaterion = Quaternion.fromVector({ vector });

    // Create a Quaternion from the angle and direction
    const rotationQuaterion = Quaternion.fromAngleAndDirection({ angle, direction });

    // Rotate the vector
    ({ vector } = rotationQuaterion.multiply(vectorQuaterion));

    // Update the vector with the rotated vector
    [this.x, this.y, this.z] = vector;
  }

  // Calculate the angle between two points
  angleBetweenPoint(point) {

    // Throw an error if point is not a Point
    validate({ point, Point });

    // Calculate the angle between the points
    const angle = acos(divide(dot(this, point), multiply(norm(this), norm(point))));

    // Return the angle betwen the points
    return new Angle(angle);
  }

  // Cast the point to a Vector
  toVector() {

    // Return a new Vector
    return new Vector([this.x, this.y, this.z]);
  }
}