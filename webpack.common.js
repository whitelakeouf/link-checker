const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        //add new code sources here
        popup: path.resolve('src/popup/popup.tsx'),
        options: path.resolve('src/options/options.tsx'),
        details: path.resolve('src/details/details.tsx'),
        background: path.resolve('src/background/background.ts'),
        contentScript: path.resolve('src/contentScript/contentScript.ts'),
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve('src/static'),
                    to: path.resolve('dist'),
                },
            ],
        }),
        //add new html pages here
        ...getHtmlPlugins(['popup', 'options', 'details']),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HtmlPlugin({
                title: 'Extension title',
                filename: `${chunk}.html`,
                chunks: [chunk],
            }),
    );
}
