const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Detect whether we are running in non-production modes
const isDevelopment = process.env.NODE_ENV !== 'production';
// Get needed .env variables
const {
  parsed: { API_DOMAIN },
} = dotenv.config();

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  // Enable source maps for development
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  devServer: {
    // Use the `public` directory to serve static files (e.g. favicon)
    contentBase: path.join(__dirname, 'public'),
    // Use `hotOnly` to not force browser refresh when we need to bail out
    // This is useful for a variety of cases, e.g. preserving console/debugger statements.
    hotOnly: true,
    port: 3000,
    // Only output minimal (new compile/errors) stats in terminal -
    // this is ok because we have an error overlay that shows compilation errors.
    stats: 'minimal',
    // Use native WebSockets instead of SockJS
    transportMode: 'ws',
  },
  entry: {
    main: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: path.join(__dirname, 'src'),
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
  },
  plugins: [
    // Enable React Refresh for better development experience (Reliable HMR)
    isDevelopment && new ReactRefreshPlugin(),
    // Since we use Babel for TypeScript transpiling,
    // we will run TS as a separate process to get type errors during builds.
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './public/index.html',
    }),
    // Inject needed environment variables to the bundle
    new webpack.DefinePlugin({
      'process.env.API_DOMAIN': JSON.stringify(API_DOMAIN),
    }),
    // For production, copy the favicon to the output destination
    !isDevelopment &&
      new CopyWebpackPlugin({
        patterns: [{ from: 'public/favicon.ico' }],
      }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
