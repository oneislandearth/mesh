const { resolvePath } = require('babel-plugin-module-resolver');

module.exports = {
  presets: [
    ['@babel/preset-env', {
      loose: true,
      targets: {
        node: true
      }
    }]
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        core: './core',
        geometry: './geometry',
        shapes: './shapes',
        utils: './utils'
      },
      resolvePath(source, current, opts) {
        
        // Use the default function to resolve the path
        let path = resolvePath(source, current, opts);

        // Return if there is not a path
        if (!path) return;

        // Root path resolving
        if (path.match(/^(.\.\/(?:[\w\-\_]+))/)) return path.replace('../', './');

        // Secondary path resolving
        if (path.match(/^(.\.\/.\.\/(?:[\w\-\_]+))/)) return path.replace('../../', '../');
      }
    }]
  ]
}