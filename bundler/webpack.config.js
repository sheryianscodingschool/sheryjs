const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/Shery.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'Shery.js',
    library: 'Shery',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  externals: {
    gsap: 'gsap',          
    three: 'THREE',       
    controlkit: 'ControlKit', 
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `@license\nCopyright 2023-${new Date().getFullYear()} Three.js Aayush Chouhan, Harsh Vandana Sharma\nLicense: MIT`
    }),
    new MiniCssExtractPlugin({
      filename: 'Shery.css', // Output CSS filename
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(), // Add this line for JS minification
    ],
  },
}
