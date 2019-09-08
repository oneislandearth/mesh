// Define a class for returning numbers as meters with units
export class Meters extends Number {

  // Pass the number to Number
  constructor(number) {
    super(number);
  }

  // Define the value to return as a number
  static get() {
    return this; 
  }

  // Round the mesh to three significant figures as to include up to milimeters
  toString() {
    return `${this.toFixed(3)} meters`;
  }

}