// Import the required math functions
import { cross, dot, add, multiply, divide, subtract, epsilon, norm, det, transpose, isZeroes } from '@oneisland/math';

// Import the required geometry modules
import { Line } from 'geometry/line';
import { Point } from 'geometry/point';
import { Polygon } from 'geometry/polygon';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Plane');

// Define a plane
export class Plane {

  // Create a new Plane from a scalar and normal
  constructor({ normal, scalar }) {

    // Throw an error if the normal is not a Direction
    validate({ normal }, 'Direction');

    // Throw an error if the scalar is not a Number
    validate({ scalar }, 'Number');

    // Bind the normal and scalar
    this.normal = normal;
    this.scalar = scalar;
  }

  // Define the species
  get species() {

    // Define the species as 'Plane'
    return 'Plane';
  }

  // Create a plane from a polygon
  static fromPolygon(polygon) {

    // Throw an error if the polygon is not a Polygon
    validate({ polygon }, 'Polygon');

    // Calculate the normal of the Plane
    const normal = new Direction(cross(subtract(polygon[1], polygon[0]), subtract(polygon[2], polygon[0])));

    // Calculate the scalar of the Plane
    const scalar = dot(normal, polygon[0]);

    // Return the Plane from the polygon
    return new Plane({ normal, scalar });
  }

  // Clone the current plane
  clone() {

    // Return a clone of the plane
    return new Plane({ normal: this.normal, scalar: this.scalar });
  }

  // Flip the current plane
  flip() {

    // Flip the sign on the normal and scalar
    this.normal = multiply(this.normal, -1);
    this.scalar = multiply(this.scalar, -1);
  }

  // Scale the plane from a distance
  scale(distance) {

    // Throw an error if the distance is not a Number
    validate({ distance }, 'Number');

    // Scale the plane by a distance
    // this.scalar = add(this.scalar, multiply(distance, norm(this.normal)));
    this.scalar = add(this.scalar, distance);
  }

  // Check if the plane contains a point
  containsPoint(point) {

    // Determine if the plane contains a point
    return (subtract(this.scalar, dot(this.normal, point)) <= epsilon);
  }

  // Calculate the line of intersection with another plane
  lineOfIntersectionWith(plane) {

    // Throw an error if the plane is not a Plane
    validate({ plane }, 'Plane');

    // Extract the normal and scalar values from the planes
    const [n1, s1] = [this.normal, this.scalar];
    const [n2, s2] = [plane.normal, plane.scalar];

    // Calulate the direction of the line of intersection
    const direction = cross(n1, n2);

    // Return if the planes are parallel as there is no intersection
    if (isZeroes(direction)) return null;

    // C1 and C2 are two constants that form the first point of the line
    const c1 = divide(subtract(s1, multiply(s2, dot(n1, n2))), subtract(1, multiply(dot(n1, n2), dot(n1, n2))));
    const c2 = divide(subtract(s2, multiply(s1, dot(n1, n2))), subtract(1, multiply(dot(n1, n2), dot(n1, n2))));

    // Every line has a point and a direction, the point locates where in space the line is and the direction obviously gives the direction that the line points in
    const point = add(multiply(c1, n1), multiply(c2, n2));

    // Return the line of intersection with another plane
    return new Line({ 

      // Add the point
      point: new Point(point),

      // Add the direction
      direction: new Direction(direction)
    });
  }

  // Calculate the point of intersection with two planes
  pointOfIntersectionWithPlanes(plane1, plane2) {

    // Throw an error if plane1 and plane2 are not a Plane
    validate({ plane1, plane2 }, 'Plane');

    // Extract the normal and scalar values from the planes
    const [n1, s1] = [this.normal, this.scalar];
    const [n2, s2] = [plane1.normal, plane1.scalar];
    const [n3, s3] = [plane2.normal, plane2.scalar];

    // Calculate the determinant of the normals from the planes
    const determinant = det([n1, n2, n3]);

    // Check if there no intersection and if so return false
    if (isZeroes(determinant)) return null;

    // Calculate the point of intersection from the planes
    const intersection = divide(add(multiply(s1, cross(n2, n3)), add(multiply(s2, cross(n3, n1)), multiply(s3, cross(n1, n2)))), determinant);
    
    // Return the point of intersection
    return new Point(intersection);
  }

  // Check if two planes are the same
  equals(plane) {

    // Throw an error if the plane is not a Plane
    validate({ plane }, 'Plane');

    // Return whether or not the planes are the same
    return (this.toString() == plane.toString());
  }

  // Cast the plane to a string
  toString() {

    // Cast the plane to a string [norm(x), norm(y), norm(z), scalar]
    return JSON.stringify([...this.normal, this.scalar]);
  }
}