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

	return config;
};