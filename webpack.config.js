const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (config) => {
	config.resolve.fallback = {
		path: false,
		fs: false,
		tls:false,
		os: false,
		crypto: false,
		process: false,
		util: false,
		assert: false,
		stream: false,
		zlib: false,
		url: false,
		http:false,
		https:false
	};

	if (config.mode === 'production') {
		config.plugins = [
			...config.plugins,
			new webpack.DefinePlugin({
				ngDevMode: false
			})
		];

		config.optimization = {
			...config.optimization,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						keep_classnames: /.*Wallet.*|.*Adapter.*|.*ModalController.*/,
						keep_fnames: /.*Wallet.*|.*Adapter.*|.*ModalController.*/,
					},
				}),
			],
		};
	}

	return config;
};