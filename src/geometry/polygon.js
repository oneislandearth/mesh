// Import the required math functions
import { cross, dot, add, abs, divide, subtract, unit } from 'utils/math';

// Import the required geometry modules
import { Plane } from 'geometry/plane';
import { Point} from 'geometry/point';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Polygon');

// Create a polygon which represents an arbitary shaped shape in 3D space
export class Polygon extends Array {

  // Create a new polygon from a number of points
  constructor(points) {

    // Check that the polygon contains three or more points
    const equals = (points) => (points.length > 2);

    // Throw an error if there are less than three points
    validate({ points, equals, expects: `"points" to contain at least three points` });

    // Check all of the points are valid
    for (const point of points) {

      // Throw an error if the point is not a Point
      validate({ point, Point, expects: `"points" to be an array of Point instances` });
    }

    // Bind the the points to the polygon
    super(...points);
  }

  // Compute the plane of the polygon
  get plane() {

    // Return the Plane from the polygon
    return Plane.fromPolygon(this);
  }

  // Compute the normal of the polygon
  get normal() {

    // Return the normal of the polygon
    return this.plane.normal;
  }

  // Compute the area of a polygon
  get area() {

    // Return the area of the polygon
    return abs(this.signedArea);
  }

  // Computed the signed area
  signedArea(normal) {

    // Define the sum of the polygon
    let sum = [0, 0, 0];
  
    // Iterate through each of the points in the polygon
    for (const i in this) {
  
      // Extract the current point
      const pi = this[i];
  
      // Extract the next point
      const pn = this[((i + 1) % this.length)];
        
      // Add to the sum
      sum = add(sum, cross(pi, pn));
    }
  
    // Return the signed area
    return divide(dot((normal) ? normal : this.plane.normal, sum), 2);
  }

  // Compute whether the winding direction is clockwise
  get clockwise() {

    // Return true as the the signed area is greater than equal to zero
    if (this.signedArea() >= 0) return true;

    // Return false as the order is counter-clockwise
    return false;
  }

  // Compute whether the polygon is coplaner
  get coplaner() {

    // Iterate through each of the points in the polygon
    for (const point of this) {

      // Return false if the point is not on the plane
      if (!this.plane.containsPoint(point)) return false;
    }

    // Return true as the polygon is coplaner
    return true;
  }

  // Flip
  flip() {
    this.plane.flip();
  }

  // Contains a point
  containsPoint(point) {

    return false;
  }
}