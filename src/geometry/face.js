// Import the required modules from mathjs
import { divide, add, subtract, norm, cross } from 'utils/math';

// Import the required utilities
import { MetricNumber } from 'utils/number';

// Import the required core modules
import { Vector } from 'core/utils/vector';

// Define a class face which is an array of three vertices plus extra properties
export class Face extends Array {

  // Bind the vertices or indices
  constructor({ indices, vertices }) {

    // Determine whether to use indices or vertices
    const [a, b, c] = (vertices) ? vertices : indices;

    // Call the super function to bind our vertices
    super(a, b, c);

    // Define whether the face is mapped vertices or indices
    this.mapped = !(indices);
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
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

  // Get the value of vertex c
  get c() {
    return this[2];
  }

  // Set the value of vertex c
  set c(c) {
    this[2] = c;
  }

  // Get the vertices from the face
  get vertices() {
    return this;
  }

  // Set the vertices for the face
  set vertices([a, b, c]) {
    [this.a, this.b, this.c] = [a, b, c];
  }

  // Get the center of a face
  get center() {

    // Check if the face is mapped
    if (!this.mapped) throw new Error(`Cannot compute the face center - the face is not mapped to vertices`);

    // Calculate the center of the face
    return new Vector(divide(add(this.a, this.b, this.c), 3));
  }

  // Get the area of the triangle
  get area() {

    // Check if the face is mapped
    if (!this.mapped) throw new Error(`Cannot compute the face area - the face is not mapped to vertices`);
  
    // Calculate the area of a triangle = norm(cross product(a-b, a-c))
    return new MetricNumber(norm(cross(subtract(this.a, this.b), subtract(this.a, this.c))));
  }

  // Map the face to the values in vertices
  mapVertices([a, b, c]) {
    
    // Set the value of the faces vertices
    [this.a, this.b, this.c] = [a, b, c];

    // Set the mapped flag to true
    this.mapped = true;

    // Return the face
    return this;
  }
}