var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target: "web",
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: "index.js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: [
            '*',
            ".webpack.js",
            ".web.js",
            ".ts",
            ".tsx",
            ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "tslint-loader",
                enforce: "pre"
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.s?css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./static", to: "./" },
            { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "./scripts" }
        ])
    ]
}