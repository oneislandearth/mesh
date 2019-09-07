// Import the required modules from mathjs
import { distance, subtract, divide, cross, add, dot, multiply, unit } from 'utils/math';

// Import the required utilities
import { MetricNumber } from 'utils/number';

// Import the required core modules
import { Direction } from 'core/utils/direction';
import { Vertex } from 'src/core/utils/vector';

// Define a class edge which is an array of three vertices plus extra properties
export class Edge extends Array {

  // Bind the vertices or indices for an edge
  constructor([a, b]) {

    // Call the super function to bind our two vertices or indices
    super(a, b);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Determine whether the edge is mapped (vertices) or not (indices)
  get mapped() {
    return (Array.isArray(this.a) && Array.isArray(this.b));
  }

  // Get the value of vertex a
  get a() {
    return this[0];
  }

  // Set the value of vertex a
  set a(a) {
    this[0] = a;
  }

  // Get the value of vertex b
  get b() {
    return this[1];
  }

  // Set the value of vertex b
  set b(b) {
    this[1] = b;
  }

  // Get the length of an edge
  get length() {

    // Check if the edge is mapped
    if (!this.mapped) throw new Error(`Cannot compute the edge length - the edge is not mapped to vertices`);

    // Calculate the length of the edge
    return new MetricNumber(distance(this.a, this.b));
  }

  // Get the direction of an edge
  get direction() {

    // Check if the edge is mapped
    if (!this.mapped) throw new Error(`Cannot compute the edge direction - the edge is not mapped to vertices`);

    // Calculate the direction of the edge
    return new Direction(unit(subtract(this.b, this.a)));
  }

  // Find a point along the edge
  lerp(fraction) {

    // Check if the edge is mapped
    if (!this.mapped) throw new Error(`Cannot compute the vector using lerp - the edge is not mapped to vertices`);
  
    // Calculate and return the new vertex
    return new Vertex(multiply(fraction, subtract(this.b, this.a)));
  }

  // Calculate the intersection with another edge
  intersectionWith(edge) {

    // Throw an error if edge is not an edge
    if (!(edge instanceof Edge)) throw new TypeError('Edge.intersectionWith expects an Edge to be passed');

    // Vector of distance to the intersection
    const distance = multiply(divide(cross(edge.direction, subtract(this.a, edge.a)), cross(edge.direction, this.direction)), this.direction);

    // Check whether the point is in front or behind the the edge's a point 
    const front = (dot(cross(edge.direction, subtract(edge.direction, edge.a)), cross(edge.direction, this.direction)) > 0);

    // Calculate the point of intersection based on whether the point is in front or not
    const intersection = (front) ? add(this.a, distance) : subtract(this.a, distance);

    // Return the point of intersection
    return new Vertex(intersection);
  }

  // Map the edge to the values in vertices
  mapVertices([a, b]) {
    
    // Set the value of the edge vertices
    [this.a, this.b] = [a, b];

    // Return the edge
    return this;
  }
}