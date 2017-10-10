const webpack = require('webpack');
const path = require("path");

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: "index.js",
        libraryTarget: "amd",
        path: path.join(__dirname, 'dist')
    },
    externals: [{
        "q": true,
        "react": true,
        "react-dom": true
    },
        /^TFS\//, // Ignore TFS/* since they are coming from VSTS host 
        /^VSS\//  // Ignore VSS/* since they are coming from VSTS host
    ],
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: 'tslint-loader',
                enforce: 'pre',
            },
            {
                test: /.tsx?$/,
                loader: 'awesome-typescript-loader',
            }]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        lazy: false,
        filename:"index.js"
    }
};