// Import the required math functions
import { radians, degrees, isNumber } from 'utils/math';


// Define a class Angle which describes an angle
export class Angle {

  // Bind the angle in radians
  constructor(angle = 0) {

    // Check whether the angle is complex number, and select the value in radians
    const radians = ((angle.re) ? angle.re : angle);

    // Throw an error if the angle is not a Number
    if (!isNumber(radians)) throw new TypeError('new Angle() expects "angle" to be a Number');

    // Bind the angle in radians
    this.radians = radians;
  }

  // Create an angle from a string (e.g. 180deg)
  static eval(string) {

    // Extract the number from the string
    let [angle] = /(([\d]*\.*[\d]+)||([\d]+\.*[\d]*))/.exec(string);

    // Throw an error if the angle string does not contain a number
    if (!angle) throw new TypeError('Angle.eval expects "string" to contain digits within in the string');

    // Cast the angle to a number
    angle = Number(angle);

    // Check if the angle is degrees
    if (string.indexOf('deg') > -1 || string.indexOf('°') > -1) {

      // Convert the angle to radians
      angle = radians(angle);
    }

    // Return the new Angle
    return new Angle(angle);
  }

  // Create a right angle
  static rightAngle() {

    // Return the right angle
    return Angle.eval('90 deg');
  }

  // Define the species to be a Number
  static get [Symbol.species]() {
    return Number; 
  }

  // // Cast the radians to a number primative
  [Symbol.toPrimitive]() {
    return this.radians;
  }

  // Determine the angle in radians
  // get radians() {

  //   // Return the angle in degrees
  //   return this.value;
  // }

  // // Update the angle from degrees
  // set radians(angle) {

  //   console.log('set rad', radians(angle))

  //   // Return the angle in degrees
  //   this.radians = angle;
  // }
  

  // Determine the angle in degrees
  get degrees() {

    // Return the angle in degrees
    return degrees(this.radians);
  }

  // Update the angle from degrees
  set degrees(angle) {

    // Return the angle in degrees
    this.radians = radians(angle);
  }

  // Get the angle as a string in degrees
  toString() {

    // Return the angle in degrees
    return `${this.degrees}°`;
  }
}