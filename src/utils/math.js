// Import the core math functions to use
import { default as math } from 'mathjs';

// Add a unit function to math
math.unit = (n) => math.divide(n, math.norm(n));

// Export math as a function
export default math;