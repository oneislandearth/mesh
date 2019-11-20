// Import the required math functions
import { divide, add, subtract, norm, cross, dot, toMeters, epsilon, pi, acos, multiply, unit, tan, angleBetween } from '@oneisland/math';

// Import the range function
// import { range } from 'utils/range_array.js';

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
    return [this.mesh.vertices[this[0]], this.mesh.vertices[this[1]], this.mesh.vertices[this[2]]];  
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
    return [new Edge([this[0], this[1]], this.mesh), new Edge([this[1], this[2]], this.mesh), new Edge([this[2], this[0]], this.mesh)];
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
      this.findAdjacentFaceFromEdgeIndex(2)];
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

  // // Find the face a specific distance above
  // pointsAbove(distance) {

  //   // Throw an error if distance is not a Number
  //   validate({ distance }, 'Number');

  //   // Create a list of planes (face, faceAB, faceBC, faceCA)
  //   const planes = [this.plane.clone(), ...this.adjacentFaces.map(face => ((face) ? face.plane.clone() : null))];

  //   // Scale each of the planes by the distance
  //   for (const i in planes) {

  //     // Check if there is a plane and scale it by the distance
  //     if (planes[i]) planes[i].scale(distance);
  //   }

  //   // Find the index of the non-existing adjacent face if there is one
  //   const missingAdjacentIndex = this.adjacentFaces.findIndex(v => v === null);

  //   // Check if there is a missing face
  //   if (~missingAdjacentIndex) {

  //     // Define which vertex from the edge to use based on which adjacent face is missing (0, 1, 2 == 2, 1, 0)
  //     const vertexIndex = (missingAdjacentIndex == 0) ? 2 : (missingAdjacentIndex == 2) ? 0 : missingAdjacentIndex;

  //     // Creates a new plane that is parallel to the xz plane and contains one point of the edge
  //     planes[1 + missingAdjacentIndex] = new Plane({
        
  //       // Calculate the normal
  //       normal: new Direction([0, 1, 0]), 
        
  //       // Calculate the scalar based on the edge
  //       scalar: dot([0, 1, 0], this.vertices[vertexIndex])
  //     });
  //   }

  //   // Extract each of the planes
  //   const [planeFace, planeFaceAB, planeFaceBC, planeFaceCA] = planes;

  //   // Finds the three lines of intersection between the original face and the three planes
  //   // const lineAB = planeFace.lineOfIntersectionWith(planeFaceAB);
  //   // const lineBC = planeFace.lineOfIntersectionWith(planeFaceBC);
  //   // const lineCA = planeFace.lineOfIntersectionWith(planeFaceCA);

  //   // Finds the three points of intersection between the three lines
  //   // const pointA = lineAB.pointOfIntersectionWithLine(lineCA);
  //   // const pointB = lineBC.pointOfIntersectionWithLine(lineAB);
  //   // const pointC = lineCA.pointOfIntersectionWithLine(lineBC);

  //   // Find the point of intersection between three faces
  //   const pointA = planeFace.pointOfIntersectionWithPlanes(planeFaceAB, planeFaceCA);
  //   const pointB = planeFace.pointOfIntersectionWithPlanes(planeFaceAB, planeFaceBC);
  //   const pointC = planeFace.pointOfIntersectionWithPlanes(planeFaceBC, planeFaceCA);

  //   // Return three points above
  //   return [pointA, pointB, pointC];
  // }

  // Updated face above method, deals with coplanar faces

  // Takes in a face and outputs the points above it, whether the faces surrounding it are coplanar or not
  pointsAbove(height) {
    // Define the array that will contain the points above the face
    const pointsAbove = [];

    console.log('test');

    console.log(this.vertices.length);

    // Iterate through each vertex in the face
    for (const vertex of this.vertices) {

      // Define the a variable that is the point that will be returned
      let point = [];

      console.log(vertex);

      // Find the index of the current vertex
      const index = vertex.index;

      // I took the code for edges without an adjacent face from the old pointsAboveFace method

      // Find the index of the non-existing adjacent face if there is one
      const missingAdjacentIndex = this.adjacentFaces.findIndex(v => v === null);

      // Check if there is a missing face
      if (missingAdjacentIndex !== -1) {

        // Define which vertex from the edge to use based on which adjacent face is missing (0, 1, 2 == 2, 1, 0)
        const vertexIndex = (missingAdjacentIndex == 0) ? 2 : (missingAdjacentIndex == 2) ? 0 : missingAdjacentIndex;

        // Creates a new plane that is parallel to the xz plane and contains one point of the edge
        this.planes[1 + missingAdjacentIndex] = new Plane({
          
          // Calculate the normal
          normal: new Direction([0, 1, 0]), 
          
          // Calculate the scalar based on the edge
          scalar: dot([0, 1, 0], this.vertices[vertexIndex])
        });
      }

      // Finds one edge that contains the vertex 
      const edgeNow = this.edges[index];

      // Finds the other edge that contains the vertex (can be used for a polygon of any number of vertices, providing one edge of the polygon has at most one adjacent face)
      // Finds the edge before the edge defined above
      const edgeBefore = this.edges[((index + (this.vertices.length - 1)) % this.vertices.length)];

      // Finds the faces that contain edgeNow and edgeBefore

      const faceNow = this.findAdjacentFaceFromEdgeIndex(index);

      const faceBefore = this.findAdjacentFaceFromEdgeIndex(((index + (this.vertices.length - 1)) % this.vertices.length));

      // Checks if the three faces (face, faceNow, faceBefore) are not parallel, if that is the case compute the normals as per usual
      if (((cross(faceNow.normal, faceBefore.normal) > epsilon) && ((cross(this.normal, faceBefore.normal) > epsilon) && ((cross(faceNow.normal, this.normal) > epsilon))))) {

        // Creates three new planes identical to the planes of the three faces, and scales them the distance desired
        const newPlane1 = this.plane;
        const newPlane2 = faceBefore.plane;
        const newPlane3 = faceNow.plane;

        newPlane1.scale(height);
        newPlane2.scale(height);
        newPlane3.scale(height);

        // Runs three plane intersection on the three planes
        point = newPlane1.pointOfIntersectionWithPlanes(newPlane2, newPlane3);
      }
      
      // If any two of the three faces are parallel, we try to find three faces that contain the vertex that are not parellel. If this fails, we have a point surrounded by parallel faces,
      // so we return the point plus the height times the normal of the original face, so the point is directly above where it was by a distance of height.
      else {

        // A list of the faces that contain the vertex
        const containsVertex = [];

        // Find all the faces that contain the vertex
        for (const fac of this.mesh.faces) {

          // Fac has to be different than the original face
          if (!fac.equals(this)) {

            // Fac must contain vertex
            if (fac.contains(vertex)) {

              // Add to the list of faces that contain the vertex

              containsVertex.push(fac);
              
            }
          }
        }

        // Iterate through the faces and find if there are a combination of three that are not parallel.

        // Essentially we need to compute whats known in mathematics as a combination, or n choose r, where n
        // is the number of things we are choosing from and r is the size of the combination. For this case we don't 
        // know how many faces contain the vertex, so we call that n, and we need 3 faces to find the three_plane_intersection,
        // so for this case we need n choose 3. We also only need to find one combination of three faces that are not parallel 
        // with each other, so we need to break the loop early if thats the case as we're done, as computing cross products is
        // expensive and we want to avoid doing it.

        // An array of the indices of containsVertex (from 0 to containsVertex.length - 1)
        const array = new Array(containsVertex.length).fill(0).
map((v, i) => i);

        // Gives a list of the first elements of the combinations, and we have
        // length - 2 because slice excludes the element of the end index, since we
        // need two more elements from the last element of the listoffirstelements
        // to give us a total of three elements, ie if we let listoffirstelements
        // run across the whole array we'd have outputs where it would loop around from 
        // the end of the array, giving us repeats. We use the indexes so we can preserve
        // where it is in relation to the whole list, and not have to call a function like
        // findIndexOf everytime we have an element. We return to the actual elements at the end
        // when outputting the result.

        const listOfFirstElements = array.slice(0, (array.length - 2));

        let result = '';

        // Use each element of listoffirst elements as the first element of the combination
        loop1:
        for (const element of listOfFirstElements) {

          // We need the list of second elements to range from the next element than the current
          // one of listoffirstelements, to the element before the last, so we can save the last at
          // the very least for the listofthirdelements to preserve a length of 3 for all combinations
          const listOfSecondElements = array.slice(element + 1, array.length - 1);

          loop2:
          // Use each element of listofsecondelements as the second element of the combination
          for (const el of listOfSecondElements) {

            // We can range the listofthirdelements from the next element from the current element
            // of listofsecondelements to the end, since we only have three elements in our permutations    
            const listOfThirdElements = array.slice(el + 1);
            
            // If element and el meet some condition, in this case that they are not parallel, 
            // move onto the next one in the loop for listofsecondelements
            if (cross(containsVertex[element].normal, containsVertex[el].normal) < (epsilon, epsilon, epsilon)) {
              continue; 
            }

            // We compute the point based on only having two different normals for all the faces that contain the point given.
            // This corresponds to having a vertex located on an edge, like the edge of a bench. All of the faces that contain
            // the point either have one normal, for the top of the bench, or another normal, over the edge of the bench, like
            // in the below diagram.
            //
            //
            //     ^ (first normal)
            // ----|-----
            //          |
            //          | -> (second normal)
            //          |
            //          |
            //
            // Using trigonometry and the our knowldege of the angle between the normals, the distances above the planes and the 
            // relations between the vectors (ie that the point we need to find is at the opposite point of a kite) we can calculate
            // the point just based on the two faces. We leave it to be updated in loop3 if we discover a third face that has a different
            // normal to the first and the second.
            //

            const angleBetweenNormals = divide(angleBetween(containsVertex[element], containsVertex[el]), 2);

            const c = Math.sqrt(add(Math.sqrt(height), Math.pow(multiply(height, tan(angleBetweenNormals)), 2)));

            const direction = unit(add(containsVertex[element], containsVertex[el]));

            result = add(vertex, multiply(c, direction));

            loop3:
            // Iterate through the list of third elements to complete our combination
            for (const l of listOfThirdElements) {

              // If element and l or el and l meet some condition move onto the next one in the loop for listofthirdelements, else make result equal the triplet and break out of the whole loop
              if ((cross(containsVertex[element].normal, containsVertex[l].normal) < (epsilon, epsilon, epsilon)) || (cross(containsVertex[el].normal, containsVertex[l].normal) < (epsilon, epsilon, epsilon))) { 
                continue;

              }

              // Else make result equal the triplet and break out of the whole loop
              else {
                result = [containsVertex[element], containsVertex[el], containsVertex[l]];
                break loop1;
              }
            }
          }
        }

        // If we have a point surrounded by parallel faces (so the loop has run through and hasn't updated result, so result will be '', which is false)
        // then we add the normal of the face times the height to the point, so we make the point above directly above it.
        if (!result) {
          point = add(vertex, multiply(height, unit(this.normal)));
        } 

        // If we had the case where we have an edge and only two faces to calculate it from, then the point is just the result. We test this by checking the
        // size of the first element in the array result - if it is the case where we only have two different normals the length of the first element will
        // be a single number as it will be the x coordinate, if it has made it through to loop three and updated result with the three different normals
        // it will be a vector of size 3, not just a number.
        else if (result[0].length == 1) {
          point = result;
        }

        // If we have 3 faces that contain the point and are not parallel
        else {

          // Creates three new planes identical to the planes of the three faces that we have found that are not parallel, and scales them by the distance desired
          const resultPlane1 = result[0].plane;
          const resultPlane2 = result[1].plane;
          const resultPlane3 = result[2].plane;

          resultPlane1.scale(height);
          resultPlane2.scale(height);
          resultPlane3.scale(height);
          point = resultPlane1.pointOfIntersectionWithPlanes(resultPlane2, resultPlane3);
          
        }
        

      }
      pointsAbove.push(point);
    }

    return pointsAbove;

    
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