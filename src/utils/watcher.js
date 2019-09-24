// Define a Watching class which evaluates a condition
export class Watcher {

  // Define the conditional and the limit of evaluations per cycle
  constructor(condition, limit = 500) {

    // Bind the conditional
    this.condition = condition;

    // Bind the previous state
    this.state = this.condition();

    // Bind the limit of observations
    this.limit = limit;
  }

  // Define a handler for a condition state change
  async once(handler) {

    // Wait for the condition to be evaluated
    const result = await Promise((resolve, reject) => {

      // Define the number of iterations
      let iterations = 0;
    
      // Set timeout for 10ms
      const timeout = () => setTimeout(() => {

        // Evalute the current condition
        const state = this.condition();
    
        // Check if the condition has changed
        if (state != this.state) {
    
          // Resolve the promise
          resolve(state);
        }
    
        // If there have been more iterations than the limit
        if (iterations >= this.limit) {
    
          // Reject the promise as it has timeout out
          reject(new Error(`Watcher has timed out (limit ${this.limit * 10}ms)`));
        }
    
        // Increment the iterations
        iterations++;
    
        // Call the timeout function again
        timeout();
      }, 10);
    
      // Call the timeout function
      timeout();
    });

    // Call the handler function
    handler(result);

    // Resolve the result
    return result;
  }

  // Define a handler for a condition state change many times
  async on(handler) {

    // Wait for the result of once function and pass the handler
    const state = await this.once(handler);

    // Update the state value
    this.state = state;

    // Call the on function again with the handler
    this.on(handler);
  }
}