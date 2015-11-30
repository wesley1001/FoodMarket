var path = require('path');
var webpack = require('webpack');
module.exports= {
    entry: {
        app: ['./src/js/app.js'],
    },
    output: {
        path: './public/js',
        filename: '[name].js',
        publicPath: '/public/js'
    },
    resolve: {
        root: [path.join(__dirname, "/src/bower_components")]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};