const path = require('path');

let minConfig = {
    entry: './src/core/index.js',
    output: {
        path: path.join(__dirname,"dist"),
        filename: 'agamotto-eye.min.js',
    },
}

let indexConfig = {
    entry: './src/core/index.js',
    output: {
        path: __dirname,
        filename: 'index.js',
    },
}

module.exports = [
    indexConfig,minConfig
]