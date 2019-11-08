// Import the required math functions
import { divide, add, subtract, norm, cross, dot, toMeters, epsilon, pi, acos, multiply, unit } from '@oneisland/math';

// Import the required geometry modules
import { Plane } from 'geometry/plane';
import { Point } from 'geometry/point';

// Import the required geometry utilities
import { Direction } from 'geometry/utils/direction';

// Import the required shape modules
import { Edge } from 'shape/edge';

// Imoprt point in polygon function
// Import { pointInsideTetrahedron } from 'point_inside_tetrahedron.js';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Face');

// Define a class face which is an array of three vertices plus extra properties
export class Face extends Array {

  // Bind the indices to the mesh and any mesh
  constructor([a, b, c], mesh = null) {

    // Throw an error if a, b or c is not a Number
    validate({ a, b, c }, 'Number');

    // Throw an error if the mesh in not a Mesh
    validate({ mesh }, 'Mesh');

    // Call the super function to bind our indices
    super(a, b, c);

    // Bind the reference to the current mesh if there is one
    this.mesh = mesh;
  }

  // Define the species
  get species() {
  
    // Define the species as 'Face'
    return 'Face';
  }

  // Define the species to be an array
  static get [Symbol.species]() {
    return Array; 
  }

  // Find the index of the face in the mesh faces
  get index() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the index - the face is not bound to a Mesh`);

    // Return the index of the face in the faces
    return Number(this.mesh.faces.findIndex(face => face.equals(this)));
  }

  // Compute the value of vertex a
  get a() {
    return this.vertices[0];
  }

  // Compute the value of vertex b
  get b() {
    return this.vertices[1];
  }

  // Compute the value of vertex c
  get c() {
    return this.vertices[2];
  }

  // Find the vertices for the face based on the indices
  get vertices() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the vertices - the face is not bound to a Mesh`);

    // Return the vertices based on the indices
    return [
      this.mesh.vertices[this[0]], 
      this.mesh.vertices[this[1]], 
      this.mesh.vertices[this[2]]
    ];  
  }

  // Find the Plane from a face
  get plane() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face plane - the face is not bound to a Mesh`);

    // Calculate the normal of the Plane
    const normal = new Direction(cross(subtract(this.a, this.b), subtract(this.c, this.b)));

    // Calculate the scalar of the Plane
    const scalar = dot(normal, this.a);

    // Return the Plane from the Face
    return new Plane({ normal, scalar });
  }

  // Compute the normal of the face
  get normal() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the normal of the face - the face is not bound to a Mesh`);

    // Return the normal for the face
    return this.plane.normal;
  }
  
  // Compute the vertex normals
  get vertexNormals() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the vertex normals of the face - the face is not bound to a Mesh`);
  }

  // Find the edges from the face
  get edges() {

    // Return the edges in the face (ab, bc, ca)
    return [
      new Edge([this[0], this[1]], this.mesh), 
      new Edge([this[1], this[2]], this.mesh), 
      new Edge([this[2], this[0]], this.mesh)
    ];
  }

  // Compute the center of a face
  get center() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face center - the face is not bound to a Mesh`);

    // Calculate the center of the face
    return new Point(divide(add(this.a, this.b, this.c), 3));
  }

  // Compute the area of a mesh
  get area() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the face area - the face is not bound to a Mesh`);
  
    // Calculate the area of a triangle = norm(cross product(a-b, a-c))
    return toMeters(divide(norm(cross(subtract(this.a, this.b), subtract(this.a, this.c))), 2));
  }

  // Find the adjacent faces to the face
  get adjacentFaces() {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the adjacent faces - the face is not bound to a Mesh`);

    // Return the list of adjacent faces
    return [
      
      // Find face at edge ab/ba
      this.findAdjacentFaceFromEdgeIndex(0), 
      
      // Find face at edge bc/cb
      this.findAdjacentFaceFromEdgeIndex(1),

      // Find face at edge ca/ac
      this.findAdjacentFaceFromEdgeIndex(2)
    ];
  }

  // Find an adjacent face from an edge index (0: ab, 1: bc, 2: ca)
  findAdjacentFaceFromEdgeIndex(edgeIndex) {

    // Check if the face is bound to a mesh and if not throw an error
    if (!this.mesh) throw new Error(`Cannot compute the adjacent face fom the edge index - the face is not bound to a Mesh`);

    // Determine the vertex which make up the edge
    const i0 = (edgeIndex);
    const i1 = ((edgeIndex + 1) % 3);

    // Determine the vertex which is not part of the edge
    const i2 = ((edgeIndex + 2) % 3);

    // Find the index of the adjacent face
    const faceIndex = this.mesh.faces.findIndex(face => {
      
      // Check that the face contains i0 and i1 (the edge)
      const edgeCheck = (~face.indexOf(this[i0]) && ~face.indexOf(this[i1]));

      // Check that the face doesn't contain the current index (same face)
      const otherCheck = (face.indexOf(this[i2]) == -1);

      // Return true if the face is an adjacent face
      return (edgeCheck && otherCheck);
    });

    // Return null if there is no face / face index, or return the face
    return (~faceIndex) ? this.mesh.faces[faceIndex] : null;
  }

  // Find the face a specific distance above
  pointsAbove(distance) {

    // Throw an error if distance is not a Number
    validate({ distance }, 'Number');

    // Create a list of planes (face, faceAB, faceBC, faceCA)
    const planes = [this.plane.clone(), ...this.adjacentFaces.map(face => ((face) ? face.plane.clone() : null))];

    // Scale each of the planes by the distance
    for (const i in planes) {

      // Check if there is a plane and scale it by the distance
      if (planes[i]) planes[i].scale(distance);
    }

    // Find the index of the non-existing adjacent face if there is one
    const missingAdjacentIndex = this.adjacentFaces.findIndex(v => v === null);

    // Check if there is a missing face
    if (~missingAdjacentIndex) {

      // Define which vertex from the edge to use based on which adjacent face is missing (0, 1, 2 == 2, 1, 0)
      const vertexIndex = (missingAdjacentIndex == 0) ? 2 : (missingAdjacentIndex == 2) ? 0 : missingAdjacentIndex;

      // Creates a new plane that is parallel to the xz plane and contains one point of the edge
      planes[1 + missingAdjacentIndex] = new Plane({
        
        // Calculate the normal
        normal: new Direction([0, 1, 0]), 
        
        // Calculate the scalar based on the edge
        scalar: dot([0, 1, 0], this.vertices[vertexIndex])
      });
    }

    // Extract each of the planes
    const [planeFace, planeFaceAB, planeFaceBC, planeFaceCA] = planes;

    // Finds the three lines of intersection between the original face and the three planes
    // const lineAB = planeFace.lineOfIntersectionWith(planeFaceAB);
    // const lineBC = planeFace.lineOfIntersectionWith(planeFaceBC);
    // const lineCA = planeFace.lineOfIntersectionWith(planeFaceCA);

    // Finds the three points of intersection between the three lines
    // const pointA = lineAB.pointOfIntersectionWithLine(lineCA);
    // const pointB = lineBC.pointOfIntersectionWithLine(lineAB);
    // const pointC = lineCA.pointOfIntersectionWithLine(lineBC);

    // Find the point of intersection between three faces
    const pointA = planeFace.pointOfIntersectionWithPlanes(planeFaceAB, planeFaceCA);
    const pointB = planeFace.pointOfIntersectionWithPlanes(planeFaceAB, planeFaceBC);
    const pointC = planeFace.pointOfIntersectionWithPlanes(planeFaceBC, planeFaceCA);

    // Return three points above
    return [pointA, pointB, pointC];
  }
  
  // Calculate the dihedrals for a face
  get dihedrals() {

    // This array will contain three sub arrays (one for each connected face if it exists, if not it will return false),
    // With the sub arrays containing two values, the dihedral angle and if the edge is a valley or a ridge. A valley is
    // Where the two faces bend towards each other, like \/, and a ridge is where they bend away from each other, like /\.
    // This becomes important as when creating the struts one needs to tell the difference in order to keep the strut width
    // The same, otherwise creating a valley as a ridge will cause the struts to be wider, or even incorrect.
    // Dihedral must not go below 27 degrees for a 2x4 strut

    const dihedrals = [];

    // Iterates through each adjacent face, if it exists, and updates the dihedral and it's type
    for (const adjacentFace of this.adjacentFaces) {

      // Extract the adjacent face
      // const adjacentFace = this.adjacentFaces[i];

      // Checks the face exists, if so proceed
      if (adjacentFace) {

        // Finds the angle between their normals
        const angle = acos(divide(dot(this.normal, adjacentFace.normal), multiply(norm(this.normal), norm(adjacentFace.normal))));

        // Finds the dihedral angle (interior angle)
        const dihedral = divide(subtract(pi, angle), 2);

        // // Creates a test point to see if the normal direction is inside or outside the tetrahedron formed by the two faces
        // // Note: assumes face winding has already been performed.
        // const testpoint = multiply(multiply(epsilon, 2), adjacentFace.normal);

        // // Finds the four points that make up the tetrahedron
        // const tetrahedron = this.vertices;

        // // Iterate through each of the points in the adjacent face
        // for (const point of adjacentFace) {

        //   // Check that the point is not in the face and add it to the tetrahedron
        //   if (!this.contains(point)) tetrahedron.push(point);
        // }

        // Create a tetrahedron from the points


        // If the testpoint is in the tetrahedron, then it returns the dihedral and 'valley', else it returns the dihedral and 'ridge'
        // PointInsideTetrahedron(tetrahedron, testpoint) ? dihedrals.push([dihedral, 'valley']) : dihedrals.push([dihedral, 'ridge']);

        // Add the dihedrals
        dihedrals.push({ angle: dihedral, type: 'ridge' });

      } else {

        // The projected normal of the face, projected onto the xz axis
        const projectedNormal = [this.normal[0], 0, this.normal[2]];

        // Find the angle between the two planes
        const angle = acos(divide(dot(projectedNormal, this.normal), multiply(norm(projectedNormal), norm(this.normal))));

        // Finds the dihedral from the angle
        const dihedral = divide(subtract(pi, angle), 2);

        // Add the flat dihedral for the bottom struts
        dihedrals.push({ angle: dihedral, type: null });
      }
    }

    // Return the dihedrals
    return dihedrals;
  }

  // Calculate the radials for a face
  get radials() {

    // Create a list of radial angles
    const radials = [];

    // Iterate through each of the points
    for (const i in this.vertices) {

      // Define the set of indexes
      const [i0, i1, i2] = [Number(i), ((Number(i) + 1) % 3), ((Number(i) + 2) % 3)];

      // Multiply the normals (ab, ac)
      const normals = multiply(norm(subtract(this.vertices[i1], this.vertices[i0])), norm(subtract(this.vertices[i2], this.vertices[i0])));

      // Calculate the radial angle
      const radial = acos(divide(dot(subtract(this.vertices[i1], this.vertices[i0]), subtract(this.vertices[i2], this.vertices[i0])), normals));
    
      // Add the radial angle to the list
      radials.push(radial);
    }

    // Return the radials for the face
    return radials;
  }

  // Update the indices in the face
  update([a, b, c]) {

    // Throw an error if a, b or c is not a Number
    validate({ a, b, c }, 'Number');

    // Update the indices
    this[0] = a;
    this[1] = b;
    this[2] = c;
  }

  // Flip the current face
  flip() {

    // Switch the order from a, b, c to c, b, a
    this[0] = this[2];
    this[2] = this[0];

    // Flip the plane
    this.plane.flip();
  }

  // Cast the face to a string
  toString() {
    
    // Return the stringified face
    return JSON.stringify(this);
  }

  // Evaluate if two faces are the same
  equals(face) {

    // Throw an error if face is not a Face
    validate({ face }, 'Face');

    // Check that the faces equal the same value
    return (this.toString() === face.toString());
  }

  // Evaluate if the face contains a vertex
  contains(vertex) {

    // Throw an error if vertex is not a Vertex
    // Validate({ vertex, Vertex });

    // Find the vertex within the face
    const match = this.vertices.find(v => v.toString() == JSON.stringify(vertex));

    // Return true if the vertex is in the face
    return Boolean(match);
  }
}