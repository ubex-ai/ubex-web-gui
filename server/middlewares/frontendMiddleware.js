/* eslint-disable global-require */

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
	const isProd = process.env.NODE_ENV === 'production';

	if (isProd) {
		const addProdMiddlewares = require('./addProdMiddlewares');
		addProdMiddlewares(app, options);
	} else {
		try {
			const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
			const addDevMiddlewares = require('./addDevMiddlewares');
			addDevMiddlewares(app, webpackConfig);
		} catch (e) {
			throw new Error('webpack.dev.babel not loading', e);
		}
	}

	return app;
};
