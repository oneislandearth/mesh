// Import the require modules
import { Vector } from 'geometry/vector';

// Calculate a Quaternion from a scalar and vector
export class Quaternion extends Array {

  // Create a new Quaternion from the scalar and vector
  constructor({ scalar, vector }) {

    // Throw an error if the scalar is not a Number
    if (typeof scalar != 'number') throw new TypeError('new Quaternion() expects "scalar" to be a Number');

    // Throw an error if the vector is not a Vector
    if (!(vector instanceof Vector)) throw new TypeError('new Quaternion() expects "vector" to be a Vector');

    // Call the super function to bind our coodinates to the array
    super(scalar, ...vector);
  }

  // Create a new Quaterion from a Vertex
  static fromVertex({ vertex }) {

    // Throw an error if the vertex is not a Vertex
    if (!(vertex instanceof Vertex)) throw new TypeError('Quaternion.fromVertex expects "vertex" to be a Vertex');

    // Return the new Quaternion
    return new Quaternion({ 

      // Add the scalar value
      scalar: 0, 

      // Cast the Vertex to a Vector
      vector: vertex.toVector()
    });
  }

  // Create a new Quaternion from a Point
  static fromPoint({ point }) {

    // Throw an error if the point is not a Point
    if (!(point instanceof Point)) throw new TypeError('Quaternion.fromPoint expects "point" to be a Point');

    // Return the new Quaternion
    return new Quaternion({ 

      // Add the scalar value
      scalar: 0, 

      // Cast the Point to a Vector
      vector: point.toVector()
    });
  }

  // Create a new Quaternion from a rotaton (angle and axis)
  static fromRotation({ rotation }) {

    // Throw an error if the rotation is not a Rotation
    if (!(angle instanceof Angle)) throw new TypeError('Quaternion.fromRotation expects "rotation" to be a Rotation');

    // Extract the angle and x, y, z values
    const { angle, axis } = rotation;

    // Return the Quaternion
    return new Quaternion({ 

      // Calculate the scalar
      scalar: cos(divide(angle, 2)), 

      // Calculate the vector
      vector: new Vector([

        // Calculate the x value
        multiply(sin(divide(angle, 2)), axis.x),

        // Calculate the y value
        multiply(sin(divide(angle, 2)), axis.y),

        // Calculate the z value
        multiply(sin(divide(angle, 2)), axis.z)
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