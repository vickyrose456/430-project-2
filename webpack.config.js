const path = require('path');

module.exports = {
    entry:{
        app: './client/maker.jsx',
        login: './client/login.jsx',
        paidProfilePage: './client/paidProfilePage.jsx',
    },
    //module update tells webpack to use babel-loader to handle js or jsx files
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};