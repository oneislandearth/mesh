// Define a class for returning numbers as meters with units
export class Meters {

  // Pass the number to Number
  constructor(number) {
    
    // Bind the number value
    this.value = number;
  }

  // Round the mesh to three significant figures as to include up to milimeters
  [Symbol.toPrimitive](type) {

    // Cast the number to a string
    if (type == 'string') return `${this.value.toFixed(3)} meters`;
    
    // Cast the number to a number
    return Number(this.value);
  }
}