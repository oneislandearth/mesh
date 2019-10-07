
// Import the required math functions
import { sign, dot, cross, subtract } from '@oneisland/math';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Edge');

// Used for checking whether there is a point inside a tetrahedron
export class Tetrahedron {

  // Create a tetrahedron from four points
  constructor([a, b, c, d]) {

    // Throw an error if a, b, c or d is not a Point or Vertex
    validate({ a, b, c, d }, ['Point', 'Vertex']);

    // Bind all of the points to the tetrahedron
    this.points = [a, b, c, d];
  }

  // Check if the tetrahedron contains a point
  containsPoint(point) {

    // Throw an error if point is not a Point or Vertex
    validate({ point }, ['Point', 'Vertex']);

    // Check the side for each of the faces
    for (const side in this.points) {

      // Extract the points in order based on side
      const [a, b, c, d] = [
        this.points[side],
        this.points[((side + 1) % this.points.length)],
        this.points[((side + 2) % this.points.length)],
        this.points[((side + 3) % this.points.length)]
      ];

      // Calculate the normal of the face
      const normal = cross(subtract(b, a), subtract(c, a));

      // Return false if the point is on the same side (is on the face)
      if (sign(dot(normal, subtract(d, a))) != sign(dot(normal, subtract(point, a)))) return false;
    }

    // The point passed all the checks so must be on the same plane as the tetrahedron points and not on the face
    return true;
  }
}