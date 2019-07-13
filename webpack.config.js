var path = require('path');

module.exports = {
    // Change to your "entry-point".
    entry: {
      mundane: ['@babel/polyfill','./src/Mundane.ts'],
      test: ['./src/Mundane.test.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, and js files.
            test: /\.(tsx?)|(js)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    }
};