const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: [
            'fetch-getplants-spec.js',
            './build/index.js',
            './build/specs/hello-integration-spec1.js',
            './build/specs/hello-integration-spec2.js',
        ],
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        clean: true,
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template-mocha-testrunner.html',
        }),
        new SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
        new TsConfigPathsPlugin({
            configFile: './tsconfig.json',
        }),
    ],
};
