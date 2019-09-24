// Import the required geometry modules
import { Polygon } from 'geometry/polygon';

// Import the required shape modules
import { Face } from 'shape/face';

// Import the required utilities
import { CircularArray } from 'utils/circular';
import { Validator } from 'utils/validator';

// Define a validator for the class
const { validate } = new Validator('Triangulator');

// Triangulate a face based on a modification of the two-ears algorithm
export class Triangulator extends CircularArray {

  // Create a triangulation from a face
  constructor(face, mesh = null) {

    // Define the indices as the face data
    const indices = face;

    // Map the indices to vertices
    const vertices = indices.map(vertex => mesh.vertices[vertex]);

    // Bind the indices and vertices to a circular array
    super({ indices, vertices });

    // Define the list of faces which have been found
    this.splitFaces = [];

    // Form a polygon to determine the correct winding order
    const polygon = new Polygon(vertices.map(vertex => vertex.toPoint()));

    // Bind the normal for the plane
    this.normal = polygon.normal;

    // Check that the polygon is coplaner
    const equals = (polygon) => polygon.coplaner;

    // Throw an error if the order is not valid
    validate({ polygon, equals, expects: 'the "face" to be coplaner' });

    // Check if the polygon winding order is counter-clockwise 
    if (polygon.clockwise) {
      
      // Reverse the order of indices and vertices
      this.reverse();
    }

    // Iterate through each of the indices
    while (this.length > 2) {

      // Select the current face from the vertices
      const splitFace = this.sliceFace();

      // Check if the split face was extracted
      if (!this.extractSplitFace(splitFace)) {

        // Skip to the next face extraction as this is not an ear
        this.current++;

        // Resest to zero as the length has been exceeded
        if (this.current == this.length) this.current = 0;
      }
    }
  }

  // Split the face up into a three point face with the central vertex and it's two neighbours in the indices loop
  sliceFace(centralIndex = null) {

    // Remember the old index value
    const currentIndex = this.current;

    // Update the current index to be the central index
    if (centralIndex !== null) this.current = centralIndex;

    // Extract the indices for the triangle
    const indices = this.values('indices');

    // Extract the vertices for the triangle
    const vertices = this.values('vertices');

    // Restore the current index
    if (centralIndex !== null) this.current = currentIndex;

    // Return the indices and vertices of the sub face
    return { indices, vertices };
  }

  // Check whether a split face is valid and if so add it to the list of split faces
  extractSplitFace({ indices, vertices }) {

    // Extract the vertices from the vertices
    const [v0, v1, v2] = vertices;

    // Define the points
    const points = [v0.toPoint(), v1.toPoint(), v2.toPoint()];

    // Form a polygon from the vertices
    const polygon = new Polygon(points);

    // Return if the area is greater than 0 (is a reflex, not an ear)
    if (polygon.signedArea(this.normal) >= 0) return false;

    // Iterate through each of the vertices on the face
    for (const i in this.vertices) {

      // Map the vertex to a point
      const point = this.vertices[i].toPoint();

      // Skip to the next iteration if the point is v0, v1, or v2
      if (point.equals(v0) || point.equals(v1) || point.equals(v2)) continue;

      // Check if the current polygon contains the point
      if (polygon.containsPoint(point)) {

        // Extract the face data for the point
        const { vertices } = this.sliceFace(i);

        // Map the vertices to points
        const points = vertices.map(vertex => vertex.toPoint());

        // Find the face of the point which lies inside the polygon
        const polygon1 = new Polygon(points);

        // Return if the area is greater than 0 (is a reflex, not an ear)
        if (polygon1.signedArea(this.normal) >= 0) return false;
      }
    }

    // The current face must be valid so add the face indices to the faces array
    this.splitFaces.push(indices);

    // Remove the central vertex from the indices and update the current to be the central vertex of the next split face
    this.remove(1);

    // Return true as the face was extracted
    return true;
  }

  // Extract the faces
  toFaces(mesh) {

    // Create a list of faces
    const faces = [];

    // Iterate through each of the split faces
    for (const splitFace of this.splitFaces) {

      // Create a face from the triangle
      faces.push(new Face(splitFace, mesh));
    }

    // Return the list of faces
    return faces;
  }
}