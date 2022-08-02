const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: ['./build/index.js'],
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        clean: true,
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin(),
        new SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
    ],
};
