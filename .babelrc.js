// Import the babel config
const { babelConfig } = require('@oneisland/babler');

// Export the babel config
module.exports = babelConfig({
  ignore: [
    "./src/mesh/face_above_coplanar.js",
  ]
});