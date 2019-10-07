// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const staticPath = 'desk.st.app';
const pkg = require('../../package');
// const firebaseConfig = require('../../firebase.config.json');
module.exports = require('./webpack.base.babel')({
	mode: 'production',

	// In production, we skip all hot-reloading stuff
	entry: [require.resolve('react-app-polyfill/ie11'), path.join(process.cwd(), 'app/app.js')],

	// Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
	output: {
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		publicPath: `https://static.ubex.io/${staticPath}/${pkg.version}/`, // https://static.ubex.io/mining.app/',
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					warnings: true,
					compress: true,
					parse: {},
					mangle: true,
					output: {
						comments: false,
						ascii_only: true,
					},
				},
				parallel: true,
				cache: true,
				sourceMap: true,
			}),
		],
		nodeEnv: 'production',
		sideEffects: true,
		concatenateModules: true,
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: true,
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
					minChunks: 10,
				},
				main: {
					chunks: 'all',
					minChunks: 2,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
		runtimeChunk: true,
	},

	plugins: [
		new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
		new webpack.DefinePlugin({
			PASSPORT_URL: JSON.stringify('https://passport.st.ubex.io'),
			API_URL: JSON.stringify('https://desk.st.ubex.io'),
			STATISTIC_URL: JSON.stringify('https://desk.st.ubex.io/stats'),
			MINING_URL: JSON.stringify('https://mining.ubex.com'),
			PUBLISHER_URL: JSON.stringify('https://network.ubex.com'),
			TRADING_DESK_URL: JSON.stringify('https://desk.st.ubex.io'),
			CRYPTO_MODE: true,
			VERSION: JSON.stringify(pkg.version),
			// FIREBASE_KEY: JSON.stringify(firebaseConfig.key),
			// FIREBASE_CONFIG: JSON.stringify(firebaseConfig.config),
		}),
		// Minify and optimize the index.html
		new HtmlWebpackPlugin({
			template: 'app/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			inject: true,
		}),
		new S3Plugin({
			// Exclude uploading of html
			exclude: /.*\.html$/,
			// s3Options are required
			s3Options: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				region: 'us-east-1',
			},
			s3UploadOptions: {
				Bucket: 'static.ubex',
			},
			basePath: `${staticPath}/${pkg.version}`,
			cloudfrontInvalidateOptions: {
				DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
				Items: [`/static.ubex/${staticPath}/${pkg.version}/*`],
			},
		}),

		// Put it in the end to capture all the HtmlWebpackPlugin's
		// assets manipulations and do leak its manipulations to HtmlWebpackPlugin
		/*	new OfflinePlugin({
			relativePaths: false,
			publicPath: '/',
			appShell: '/',

			// No need to cache .htaccess. See http://mxs.is/googmp,
			// this is applied before any match in `caches` section
			excludes: ['.htaccess'],

			caches: {
				main: [':rest:'],

				// All chunks marked as `additional`, loaded after main section
				// and do not prevent SW to install. Change to `optional` if
				// do not want them to be preloaded at all (cached only when first loaded)
				additional: ['*.chunk.js'],
			},

			// Removes warning for about `additional` section usage
			safeToUseOptionalCaches: true,
		}),
*/
		new CompressionPlugin({
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),

		new WebpackPwaManifest({
			name: 'Ubex web platform',
			short_name: 'Ubex web platform',
			description: 'Ubex web platform',
			background_color: '#fafafa',
			theme_color: '#ffffff',
			inject: true,
			ios: true,
			fingerprints: false,
			icons: [
				{
					src: path.resolve('app/images/icon_180x180.png'),
					sizes: [72, 96, 128, 144, 192, 384, 512],
				},
				{
					src: path.resolve('app/images/icon_180x180.png'),
					sizes: [120, 152, 167, 180],
					ios: true,
				},
			],
		}),

		new HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20,
		}),
	],

	performance: {
		assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
	},
});
