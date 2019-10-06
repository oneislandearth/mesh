// Import the required math functions
import { cross, dot, add, abs, divide, subtract, max, multiply } from '@oneisland/math';

// Import the required geometry modules
import { Plane } from 'geometry/plane';
import { Point} from 'geometry/point';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate, validateAll } = new Validator('Polygon');

// Create a polygon which represents an arbitary shaped shape in 3D space
export class Polygon extends Array {

  // Create a new polygon from a number of points
  constructor(points) {

    // Check the polygon contains three or more points
    validate({ points }, (p) => p.length > 2, `"points" to contain at least three points`);

    // Check that the points are all points
    validateAll({ points }, ['Point', 'Vertex'], `"points" to be an array of Point instances`);

    // Bind the the points to the polygon
    super(...points);
  }

  // Define the species
  get species() {

    // Define the species as 'Polygon'
    return 'Polygon';
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

  // // Compute whether the polygon is coplanar
  // get coplanar() {

  //   // Iterate through each of the points in the polygon
  //   for (const point of this) {

  //     // Return false if the point is not on the plane
  //     if (!this.plane.containsPoint(point)) return false;
  //   }

  //   // Return true as the polygon is coplanar
  //   return true;
  // }

  // Flip
  flip() {
    this.plane.flip();
  }

  // Check if a point is contained inside the polygon using the ray-casting method
  containsPoint(point) {

    // Return false if the point is not on the plane
    if (!this.plane.containsPoint(point)) return false;

    // Define a flag for counting the even / odd crosses
    let inside = 0;
    
    // Find the largest index (x, y, z) from the polygon normal
    const projectionIndex = this.normal.findIndex(value => (value == max(...this.normal)));

    // Project the point to the polygon plane and remove the vertex component from the point which equals the projection index
    const pointProjected = point.projectToPlane(this.plane).filter((v, index) => (index != projectionIndex));

    // Remove the vertex component from each of the polygon vertices which equal the projection index
    const polygonProjected = [...this].map(polygon => polygon.filter((v, index) => (index != projectionIndex)));

    // Extract the x and y values from the projected point
    const [x, y] = pointProjected;
   
    // Let j be the index before the first index i (the last index as i is 0)
    let j = (polygonProjected.length - 1);

    // Iterate through each of the projected points in the polygon
    for (const i in polygonProjected) {

      // Extract the x and y values of index i
      const [xi, yi] = polygonProjected[i];      
      
      // Extract the x and y values of index j
      const [xj, yj] = polygonProjected[j];

      // Check whether the lines crosses the horizontal line at y in either direction, and ignore edges which it doesn't intersect with
      if (((yi <= y) && (yj > y)) || ((yj <= y) && (yi > y))) {

        // Find the intersection where the point crosses the edge of the polgygon
        const intersection = add(divide(multiply(subtract(xj, xi), subtract(y, yi)), subtract(yj, yi)), xi);

        // Check if the intersection crosses to the left of the point, and if so toggle the inside / outside check
        if (x < intersection) inside = !inside;
      }

      // Set j to the value of i
      j = i;
    }

    // If the number of crosses is odd then the point is inside
    return Boolean(inside);
  }
}