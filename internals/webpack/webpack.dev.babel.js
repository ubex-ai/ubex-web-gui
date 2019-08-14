/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = require('./webpack.base.babel')({
	mode: 'development',

	// Add hot reloading in development
	entry: [
		require.resolve('react-app-polyfill/ie11'),
		'webpack-hot-middleware/client?reload=true',
		path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
	],

	// Don't use hashes in dev mode for better performance
	output: {
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
	},

	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},

	// Add development plugins
	plugins: [
		new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
		new webpack.DefinePlugin({
			PASSPORT_URL: JSON.stringify('https://passport.ubex.com'),
			// TODO: remove API_URL
			API_URL: JSON.stringify('https://stage.ubex.io:8012'),
			MINING_API_URL: JSON.stringify('https://stage.ubex.io:8010'),
			PUBLISHER_API_URL: JSON.stringify('https://stage.ubex.io:8011'),
			TRADING_DESK_API_URL: JSON.stringify('https://stage.ubex.io:8012'),
			STATISTIC_URL: JSON.stringify('https://stats.ubex.com/v2'),
			// MINING_URL: JSON.stringify('https://mining.ubex.com'),
			// PUBLISHER_URL: JSON.stringify('https://publisher.ubex.com'),
			MINING_URL: JSON.stringify('http://localhost:3002'),
			PUBLISHER_URL: JSON.stringify('http://localhost:3001'),
			TRADING_DESK_URL: JSON.stringify('http://localhost:3000'),
			CRYPTO_MODE: true,
		}),
		new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
		new HtmlWebpackPlugin({
			inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
			template: 'app/index.html',
		}),
		new CircularDependencyPlugin({
			exclude: /a\.js|node_modules/, // exclude node_modules
			failOnError: false, // show a warning when there is a circular dependency
		}),
	],

	// Emit a source map for easier debugging
	// See https://webpack.js.org/configuration/devtool/#devtool
	devtool: 'eval-source-map',

	performance: {
		hints: false,
	},
});
