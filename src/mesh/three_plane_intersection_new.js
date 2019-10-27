// Point of intersection of three planes

import {det} from 'Libraries/math/lib/det.js'

const threePlaneIntersection = (n1, s1, n2, s2, n3, s3) {
  const determinant = det([n1, n2, n3]);

  const point = divide(add(multiply(s1, cross(n2, n3)), add(multiply(s2, cross(n3, n1)), multiply(s3, cross(n1, n2)))), determinant);

  return point;
}

