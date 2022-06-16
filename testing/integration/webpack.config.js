const path = require('path');

module.exports = {
    entry: {
        source: './src/index.ts', 
        tests: [
            './src/specs/hello-integration-specs.ts', './src/specs/status-repository-specs.ts']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
  
    mode: 'development',
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
    experiments: {
        topLevelAwait: true
    }
};