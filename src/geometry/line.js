// Import the required math functions
import { add, multiply, cross, subtract, divide, dot } from 'utils/math';

// Import the required geometry modules
import { Point } from 'geometry/point';
import { Plane } from 'geometry/plane';

// Import the required geometry utiliites
import { Direction } from 'geometry/utils/direction';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Line');

// Create a line from a Point and Direction
export class Line {

  // Bind the point and direction
  constructor({ point, direction }) {

    // Throw an error if the point is not a Point
    validate({ point, Point });

    // Throw an error if the direction is not a Direction
    validate({ direction, Direction });

    // Bind the point and direction
    this.point = point;
    this.direction = direction;
  }

  // Create a new line from two points
  static fromPoints([a, b]) {

    // Throw an error if a is not a Point
    validate({ a, Point });

    // Throw an error if a is not a Point
    validate({ b, Point });

    // Return the new Line
    return new Line({

      // Add the point
      point: a,

      // Add the direction
      direction: new Direction(subtract(b, a))
    });
  }

  // Create a new Point from a line distance
  pointFromDistance(distance) {

    // Throw an error if the distance is not a Number
    validate({ distance, Number });

    // Calculate the new point from the distance
    const point = add(this.point, multiply(distance, this.direction));

    // Return a new Point along the line
    return new Point(point);
  }

  // Create a new Line from a line distance
  lineFromDistance(distance) {

    // Throw an error if the distance is not a Number
    validate({ distance, Number });

    // Return a new Line along the line
    return new Line({ 

      // Add the point
      point: this.pointFromDistance(distance),

      // Add the direction
      direction: this.direction
    });
  }

  // Calculate the point of intersection with a plane
  pointOfIntersectionWithPlane(plane) {

    // Throw an error if plane is not a Plane
    validate({ plane, Plane });

    // Return if there is no intersection between the line and plane
    if (dot(plane.normal, this.direction)) return null;

    // Calculate the distance along the line where the line intercepts the plane
    const distance = divide(subtract(plane.scalar, dot(plane.normal, this.point)), dot(plane.normal, this.direction));

    // Return the point of intersection
    return this.pointFromDistance(distance);
  }

  // Calculate the point of intersection another line
  pointOfIntersectionWithLine(line) {

    // Throw an error if line is not a Line
    validate({ line, Line });

    // Return if there is no intersection between the two lines
    if (cross(line.direction, subtract(this.point, line.point)) || cross(line.direction, this.direction)) return null;    

    // Vector of distance to the intersection
    const distance = multiply(divide(cross(line.direction, subtract(this.point, line.point)), cross(line.direction, this.direction)), this.direction);

    // Check whether the point is in front or behind the point on a line 
    const front = (dot(cross(line.direction, subtract(line.direction, line.point)), cross(line.direction, this.direction)) > 0);

    // Calculate the point of intersection based on whether the point is in front or not
    const intersection = (front) ? add(this.point, distance) : subtract(this.point, distance);

    // Return the point of intersection
    return new Point(intersection);
  }
}