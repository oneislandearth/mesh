// Define a circular array 
export class CircularArray {

  // Create a new circular array
  constructor(array) {

    // Bind the data to the Array
    // super(...array);

    // Values
    this.values = array;

    // Define the index to be 0
    this.current = 0;
  }

  // Define a getter for the length of the array
  get length() {

    // Return the length of the array
    return this.values.length;
  }

  // Define a getter for the previous index of the array
  get previous() {

    // Return the previous index in the array
    return ((this.current + this.length - 1) % this.length);
  }

  // Define a getter for the next index of the array
  get next() {

    // Return the next index in the array
    return ((this.current + 1) % this.length);
  }

  // Reversre 
  reverse() {
    this.values.reverse();
  }

  // Remove the current index from the array and skip forward
  remove(skip = 0) {

    // Remove the current item
    this.values.splice(this.current, 1);

    // Update the current index to be current + skip
    for (let skips = 0; skips < skip; skips++) {

      // Update the current index to the next
      this.current = this.next;
    }
  }

}