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
        filename: 'index-bundle.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new SourceMapDevToolPlugin({
            filename: '[file].map',
        }),
    ],
};

// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const SourceMapLoader = require('source-map-loader');

// module.exports = {
//     mode: 'development',
//     entry: {
//         main: ['./build/index.js'],
//     },
//     output: {
//         path: path.resolve(__dirname, './dist'),
//         filename: 'index_bundle.js',
//         clean: true,
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 enforce: 'pre',
//                 use: ['source-map-loader'],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin(),
//         new CleanWebpackPlugin({
//             // Simulate the removal of files
//             //
//             // default: false
//             dry: true,

//             // Write Logs to Console
//             // (Always enabled when dry is true)
//             //
//             // default: false
//             verbose: true,

//             // Automatically remove all unused webpack assets on rebuild
//             //
//             // default: true
//             cleanStaleWebpackAssets: false,

//             // Do not allow removal of current webpack assets
//             //
//             // default: true
//             protectWebpackAssets: false,

//             // **WARNING**
//             //
//             // Notes for the below options:
//             //
//             // They are unsafe...so test initially with dry: true.
//             //
//             // Relative to webpack's output.path directory.
//             // If outside of webpack's output.path directory,
//             //    use full path. path.join(process.cwd(), 'build/**/*')
//             //
//             // These options extend del's pattern matching API.
//             // See https://github.com/sindresorhus/del#patterns
//             //    for pattern matching documentation

//             // Removes files once prior to Webpack compilation
//             //   Not included in rebuilds (watch mode)
//             //
//             // Use !negative patterns to exclude files
//             //
//             // default: ['**/*']
//             cleanOnceBeforeBuildPatterns: [
//                 '**/*',
//                 '!bundle.js',
//                 '!*.html',
//                 '!static-files*',
//                 '!directoryToExclude/**',
//             ],
//             cleanOnceBeforeBuildPatterns: [], // disables cleanOnceBeforeBuildPatterns

//             // Removes files after every build (including watch mode) that match this pattern.
//             // Used for files that are not created directly by Webpack.
//             //
//             // Use !negative patterns to exclude files
//             //
//             // default: []
//             cleanAfterEveryBuildPatterns: ['build/**'],

//             // Allow clean patterns outside of process.cwd()
//             //
//             // requires dry option to be explicitly set
//             //
//             // default: false
//             dangerouslyAllowCleanPatternsOutsideProject: true,
//         }),
//     ],
// };
