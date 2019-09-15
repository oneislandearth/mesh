// Import the required functions from math
import { isNumber } from 'utils/math';

// Check whether a variable is an instance of a type
export const isInstanceOf = ({ variable, type }) => ((variable && type) && (variable instanceof type));

// Export the validation class
export class Validator {

  // Create a new validator
  constructor(name) {

    // Validate the type of a value
    const validate = (options) => {

      // Extract the variable name and type name
      const [variable, type] = Object.keys(options).filter(key => key != 'expects');

      // Define the function name which called the validator
      let caller = '';

      // Define the regex for finding the name of the match
      const regex = /([^(]+)@|at ([^(]+) \(/igms;

      // Find the matches
      const matches = [...String(new Error().stack).matchAll(regex)];

      // Check there is a match
      for (const i in matches) {

        // Continue for the first index (reference this function)
        if (i == 0) continue;

        // Determine the caller
        caller = matches[i][2] || matches[i][3];

        // Check if the caller starts with 'Function' and replace 'Function' with the validator name
        if (caller.indexOf('Function') == 0) caller = caller.replace('Function', name);

        // Break the loop
        break;
      }

      // Create a variable for the check result
      let passed = false;

      // If there is no type
      if (!type) {

        // Extract the value from the options
        const value = Object.values(options)[0];

        // Check that the value is set
        passed = (value !== null && value != false);

      // Check if the type is number
      } else if (type.toLowerCase() == 'number') {

        // Check if the variable equals a number
        passed = isNumber(Object.values(options)[0]);

      // Check all other values with instanceof
      } else {

        // Describe the options for instanceof checking
        const [variable, type] = Object.values(options);

        // Check if the variable equals a specified type
        passed = isInstanceOf({ variable, type });
      }
      
      // If the checks fail
      if (!passed) {

        // Determine the expected outcome
        const expectation = (options.expects) ? options.expects : `"${variable}" to be a ${type}`; 

        // Determine the error message
        const message = `${caller} expects ${expectation}`;

        // Throw an error detailing the place where the error occurred
        throw new TypeError(message);
      }
    };

    // Return our validation function 
    return { validate };
  }
}