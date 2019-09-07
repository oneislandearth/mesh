import { unit, cross, dot, minus, add, multiply, divide, subtract } from 'utils/math';
import { Line } from '^/core/utils/line';

// Define the tolerance used for splitting planes
const PlaneTolerance = 1e-4;

export class Plane {

  constructor({ normal, scalar }) {

    // Bind the normal and scalar
    this.normal = normal;
    this.scalar = scalar;
  }

  static fromFace([a, b, c]) {

    // Calculate the normal of the plane
    const normal = unit(cross(minus(b, a), minus(c, a)));

    // Calculate the scalar of the plane
    const scalar = dot(normal, a);

    // Return a Plane
    return new Plane({ normal, scalar });
  }

  // Scale the plane from a distance
  scale(distance) {

    // Scale the plane by a distance
    this.scalar = add(this.scalar, distance);
  }

  // Calculate the line of intersection with another plane
  lineOfIntersectionWith(plane) {

    // Throw an error if plane is not a plane
    if (!(plane instanceof Plane)) throw new TypeError('Plane.intersectionLineWith expects a Plane to be passed');

    // Extract the normal and scalar values from the planes
    const [n1, s1] = [this.normal, this.scalar];
    const [n2, s2] = [plane.normal, plane.scalar];

    // Calulate the direction of the line of intersection
    const direction = cross(n1, n2);

    // Return if the planes are parallel as there is no intersection
    if (direction == 0) return;

    // C1 and C2 are two constants that form the first point of the line
    const c1 = divide(subtract(s1, multiply(s2, dot(n1, n2))), subtract(1, multiply(dot(n1, n2), dot(n1, n2))));
    const c2 = divide(subtract(s2, multiply(s1, dot(n1, n2))), subtract(1, multiply(dot(n1, n2), dot(n1, n2))));

    // Every line has a point and a direction, the point locates where in space the line is and the direction obviously gives the direction that the line points in
    const point = add(multiply(c1, n1), multiply(c2, n2));

    // Return the point and direction of the intersection
    return new Line({ point, direction });
  }
}