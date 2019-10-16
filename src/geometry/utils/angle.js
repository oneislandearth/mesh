// Import the required math functions
import { radians, degrees } from '@oneisland/math';

// Import the validator utility
import { Validator } from '@oneisland/validator';

// Define a validator for the class
const { validate } = new Validator('Angle');

// Define a class Angle which describes an angle
export class Angle {

  // Bind the angle in radians
  constructor(angle = 0) {

    // Check whether the angle is complex number, and select the value in radians
    angle = ((angle.re) ? angle.re : angle);

    // Throw an error if the angle is not a Number
    validate({ angle }, 'Number');

    // Bind the angle in radians
    this.angle = angle;
  }

  // Define the species
  get species() {
    
    // Define the species as 'Angle'
    return 'Angle';
  }

  // Create an angle from a string (e.g. 180deg)
  static eval(string) {

    // Extract the number from the string
    let [angle] = (/(([\d]*\.*[\d]+)||([\d]+\.*[\d]*))/).exec(string);

    // Throw an error if the angle string does not contain a number
    validate({ angle }, (a) => a, '"string" to contain digits within in the string');

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

  // Cast the radians to a number primitive
  [Symbol.toPrimitive](type) {

    // Cast the number to a string and return the angle in degrees
    if (type == 'string') return `${this.degrees.toFixed(2)}°`;
    
    // Cast the number to a number
    return Number(this.radians);
  } 

  // Determine the angle in degrees
  get radians() {

    // Return the angle in degrees
    return this.angle;
  }

  // Update the angle from radians
  set radians(angle) {

    // Throw an error if the angle is not a Number
    validate({ angle }, 'Number');
  
    // Bind the angle in radians
    this.angle = angle;
  }

  // Determine the angle in degrees
  get degrees() {

    // Return the angle in degrees
    return degrees(this.radians);
  }

  // Update the angle from degrees
  set degrees(angle) {

    // Throw an error if the angle is not a Number
    validate({ angle }, 'Number');

    // Bind the angle in degrees
    this.radians = radians(angle);
  }
}