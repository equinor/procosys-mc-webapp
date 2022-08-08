const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CopyPlugin = require('copy-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: [
            // './build/testing/integration/src/index.js',
            './build/testing/integration/src/specs/hello-integration-spec1.js',
            './build/testing/integration/src/specs/hello-integration-spec2.js',
            './build/testing/integration/src/specs/database-testing-out-specs.js',
            // './build/testing/integration/src/specs/fetch-spec3.js',
            // './build/testing/integration/src/specs/build-offline-scope-level1-entity',
        ],
    },
    output: {
        path: path.join(__dirname, './dist'),

        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        clean: true,
    },
    devtool: 'source-map',
    resolve: { extensions: ['.ts', '.js'] },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template-mocha-testrunner.html',
            inject: 'body'
        }),
        new SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
    ],
};
