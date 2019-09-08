// Import the required math functions
import { add, multiply, cross, subtract, divide, dot } from 'utils/math';

// Import the required geometry modules
import { Point } from 'geometry/point';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the required shape modules
import { Edge } from 'shape/edge';

// Create a line from a Point and Direction
export class Line {

  // Bind the point and direction
  constructor({ point, direction }) {

    // Bind the point as a Point
    this.point = new Point(point);
    
    // Bind the direction as a Direction
    this.direction = new Direction(direction);
  }

  // Create a new Point from a line distance
  pointFromDistance(distance) {

    

    // Return a new Point along the line
    return new Point(add(this.point, multiply(distance, this.direction)));
  }

  // Create a new Line from a line distance
  lineFromDistance(distance) {

    // Return a new Line along the line
    return new Line({ 
      point: this.pointFromDistance(distance),
      direction: this.direction
    });
  }

  // Create an Edge from a line distance
  edgeFromDistance(distance) {
  
    // Return a line from the two points
    return new Edge([this.point, this.pointFromDistance(distance)]);
  }

  // Calculate the intersection point with another line
  intersectionPointWith(line) {

    // Throw an error if line is not a Line
    if (!(line instanceof Line)) throw new TypeError('Line.intersectionPointWith expects "line" to be a Line');

    // Return if there is no intersection between the two lines
    if (cross(line.direction, subtract(this.point, line.point)) || cross(line.direction, this.direction)) return;    

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