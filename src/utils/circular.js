// Define a circular array 
export class CircularArray {

  // Create a new circular array
  constructor(sets) {

    // Create a list of sets
    this.sets = [];

    // Bind the sets of values
    for (const [key, values] of Object.entries(sets)) {

      // Bind the values of sets
      this[key] = values;

      // Push the key to the sets
      this.sets.push(key);

      // Check if the primary set has been bound
      if (!this.primary) {

        // Bind the primary data set
        this.primary = this[key];
      }
    }

    // Define the index to be 0
    this.current = 0;
  }

  // Define a getter for the length of the array
  get length() {

    // Return the length of the array
    return this.primary.length;
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

  // Extract a set of values based on the values
  values(key) {

    // Return the subset of values
    return [this[key][this.previous], this[key][this.current], this[key][this.next]];
  }

  // Reverse the array values
  reverse() {

    // Iterate through each of the sets of values
    for (const key of this.sets) {
    
      // Reverse the values in the array
      this[key].reverse();
    }
  }

  // Remove the current index from the array and skip forward
  remove(skip = 0) {

    // Remove the current item
    this.primary.splice(this.current, 1);

    // Update the current index to be current + skip
    for (let skips = 0; skips < skip; skips++) {

      // Update the current index to the next
      this.current = this.next;
    }
  }

}