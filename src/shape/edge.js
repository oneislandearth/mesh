// Import the required math functions
import { distance, subtract, multiply, toMeters } from 'utils/math';

// Import the required geometry modules
import { Line } from 'geometry/line';
import { Point } from 'geometry/point';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the required shape modules
import { Vertex } from 'shape/vertex';

// Import the core mesh module
import { Mesh } from 'shapes/mesh';

// Import the required utilities
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Edge');

// Define a class edge which is an array of three vertices plus extra properties
export class Edge extends Array {

  // Bind the indices of an edge with reference to the mesh
  constructor([a, b], mesh = null) {

    // Throw an error if a is not a Number
    validate({ a, Number });

    // Throw an error if b is not a Number
    validate({ b, Number });

    // Throw an error if the mesh in not a Mesh
    if (mesh) validate({ mesh, Mesh });

    // Call the super function to bind the indices
    super(a, b);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Compute the value of vertex a
  get a() {
    return this.vertices[0];
  }

  // Compute the value of vertex b
  get b() {
    return this.vertices[1];
  }

  // Find the vertices for the vertex based on the indices
  get vertices() {

    // Check if the edge is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the vertices - the edge is not bound to a Mesh`);

    // Return the vertices based on the indices
    return [
      this.mesh.vertices[this[0]], 
      this.mesh.vertices[this[1]]
    ];  
  }

  // Comput the length of an edge
  get length() {

    // Check if the edge is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the length of the edge - the edge is not bound to a Mesh`);

    // Calculate the length of the edge
    return toMeters(distance(this.a, this.b));
  }

  // Get the direction of an edge
  get direction() {

    // Check if the edge is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the direction of the edge - the edge is not bound to a Mesh`);

    // Calculate the direction of the edge
    return new Direction(subtract(this.b, this.a));
  }

  // Find a Point along the Edge
  lerp(fraction) {

    // Check if the edge is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute linear interpolation of the edge - the edge is not bound to a Mesh`);
  
    // Return the Point alone the Edge
    return new Point(multiply(fraction, subtract(this.b, this.a)));
  }

  // Cast an Edge to a Line
  toLine() {

    // Return the new Line from the Edge
    return new Line({ 
      
      // Add the point
      point: new Point(this.a), 
      
      // Add the direction
      direction: new Direction(subtract(this.b, this.a))
    });  
  }

  // Cast the edge to a string
  toString() {
    
    // Return the stringified edge
    return JSON.stringify(this);
  }

  // Evaluate if two edges are the same
  equals(edge) {

    // Throw an error if face is not a Face
    validate({ edge, Edge });

    // Check that the edges equal the same value
    return (this.toString() === edge.toString());
  }

  // Evaluate if the edge contains a vertex
  contains(vertex) {

    // Throw an error if vertex is not a Vertex
    validate({ vertex, Vertex });

    // Find the vertex within the edge
    const match = this.vertices.filter(v => v.toString() == vertex.toString());

    // Return true if the vertex is in the edge
    return Boolean(match);
  }
}