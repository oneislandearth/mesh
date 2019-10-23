// Updated face above method, deals with coplanar faces

import {range} from 'range.js';

// Takes in a face and outputs the points above it, whether the faces surrounding it are coplanar or not
pointsAboveCoplanar (height) {
  // Iterate through each vertex in the face
  for (let vertex of face) {

    // Define the a variable that is the point that will be returned
    let point = [];

    // Find the index of the current vertex
    const index = indexOf(vertex);

    // I took the code for edges without an adjacent face from the old pointsAboveFace method

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

    // Finds one edge that contains the vertex 
    const edgeNow = face.edges[index];

    // Finds the other edge that contains the vertex (can be used for a polygon of any number of vertices, providing one edge of the polygon has at most one adjacent face)
    const edgeBefore = face.edges[((index + (face.vertices.length - 1)) % face.vertices.length)];

    // Finds the faces that contain edgeNow and edgeBefore

    const faceNow = face.findAdjacentFaceFromEdgeIndex(indexOf(edgeNow));

    const faceBefore = face.findAdjacentFaceFromEdgeIndex(indexOf(edgeBefore));

    // Checks if the three faces (face, faceNow, faceBefore) are parallel, if not computes the normals as per usual
    if (((cross(faceNow.normal, faceBefore.normal) > epsilon) && ((cross(face.normal, faceBefore.normal) > epsilon) && ((cross(faceNow.normal, face.normal) > epsilon)) {

      // Runs three plane intersection on the three planes
      point = threePlaneIntersection(face.plane.normal, face.plane.scalar, faceBefore.plane.normal, faceBefore.plane.scalar, faceNow.plane.normal, faceNow.plane.scalar);

      // Add point to the updated face, unsure about how to structure this
    }

    

    // If any two of the three faces are parallel, we try to find three faces that contain the vertex that are not parellel. If this fails, we have a point surrounded by parallel faces,
    // so we return the point plus the height times the normal of the original face, so the point is directly above where it was by a distance of height.
    else {

      // A list of the faces that contain the vertex
      let containsVertex = [];

      // Find all the faces that contain the vertex
      for (let fac of faces) {

        // Fac has to be different than the original face
        if (!fac.equals(face)) {

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
      // with each other, so we need to break the loop early if thats the case as we're done, and computing cross products is
      // expensive and we want to avoid doing it.

      // An array of the indices of containsVertex
      const array = range((containsVertex.length - 1));

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
      for (const element in listOfFirstElements) {

        // We need the list of second elements to range from the next element than the current
        // one of listoffirstelements, to the element before the last, so we can save the last at
        // the very least for the listofthirdelements to preserve a length of 3 for all combinations
        const listOfSecondElements = array.slice(element + 1, array.length - 1);

        loop2:
        // Use each element of listofsecondelements as the second element of the combination
        for (const el in listOfSecondElements) {

          // We can range the listofthirdelements from the next element from the current element
          // of listofsecondelements to the end, since we only have three elements in our permutations    
          const listOfThirdElements = array.slice(element + 1);
          
          // If element and el meet some condition, in this case that they are not parallel, 
          // move onto the next one in the loop for listofsecondelements
          if (cross(containsVertex[element].normal, containsVertex[el].normal) < (epsilon, epsilon, epsilon)) {continue loop2}

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

          const c = sqrt(add(sqrt(height), square(multiply(height, tan(angleBetweenNormals)))));

          const direction = unit(add(containsVertex[element], containsVertex[el]));

          result = add(vertex, multiply(c, direction));

          loop3:
          // Iterate through the list of third elements to complete our combination
          for (const l in listOfThirdElements) {

            // If element and l or el and l meet some cElse make result equal the triplet and break out of the whole loopondition move onto the next one in the loop for listofthirdelements
            if ((cross(containsVertex[element].normal, containsVertex[l].normal) < (epsilon, epsilon, epsilon)) || (cross(containsVertex[el].normal, containsVertex[l].normal) < (epsilon, epsilon, epsilon))) {continue loop3}

            // Else make result equal the triplet and break out of the whole loop
            else {
              result = [containsVertex[element], containsVertex[el], containsVertex[l]];
              break loop1;
            }
          }
        }
      }

      // If we have a point surrounded by parallel faces (so the loop has run through and hasn't updated result, so result will be '', which is false)
      // then we add the normal of the face times the height to the point
      if (!result) {
        point = add(vertex, multiply(height, unit(face.normal)));
      } 

      // If we had the case where we have an edge and only two faces to calculate it from, then the point is just the result. We test this by checking the
      // size of the first element in the array result - if it is the case where we only have two different normals the length of the first element will
      // be a single number as it will be the x coordinate, if it has made it through to loop three and updated result with the three different normals
      // it will be a vector of size 3, not just a number.
      if (result[0].length == 1) {
        point = result;
      }

      // If we have 3 faces that contain the point and are not parallel
      else {
        point = threePlaneIntersection(result[0].plane.normal, result[0].plane.scalar, result[1].plane.normal, result[1].plane.scalar, result[2].plane.normal, result[2].plane.scalar);
      }
      

      }

  }
  return point
}