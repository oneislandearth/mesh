// Import the required geometry utilities
import { Angle } from 'geometry/utils/angle';
import { Direction } from 'geometry/utils/direction';
import { Quaternion } from 'geometry/utils/quaternion';

// Define a class Rotation which describes a rotation
export class Rotation {

  // Bind the x, y and z coordinates
  constructor({ angle, axis }) {

    // Throw an error if the angle is not an Angle
    if (!(angle instanceof Angle)) throw new TypeError('new Rotation() expects "angle" to be an Angle');

    // Throw an error if the axis is not a Direction
    if (!(axis instanceof Direction)) throw new TypeError('new Rotation() expects "axis" to be a Direction');

    // Bind the angle and axis
    this.angle = angle;
    this.axis = axis;
  }

  // Cast a rotation to a Quaternion
  toQuaternion() {

    // Return the new Quaternion
    return Quaternion.fromRotation(this);
  }

}