
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const TerserPlugin = require('terser-webpack-plugin');
    
    module.exports = {
      entry: './src/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
      module: {
        rules: [
          {
            test: /.(html)$/,
            use: ['html-loader'],
          },
          {
            test: /.js$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /.(jpg|png|gif|svg)$/,
            type: 'asset/resource',
            generator: {
              filename: 'assets/images/[hash][ext]',
            },
          },
          {
            test: /.(glsl|frag|vert)$/,
            use: ['raw-loader', 'glslify-loader'],
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
          filename: 'styles.css',
        }),
      ],
      devServer: {
        static: path.resolve(__dirname, 'dist'), 
        port: 4000,
      },
    };