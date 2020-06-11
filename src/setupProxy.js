const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use('/api', createProxyMiddleware(
					{ target: "https://us-central1-todoapp-ed9ef.cloudfunctions.net/api",
						changeOrigin: true }));
	app.use('/search', createProxyMiddleware(
				{ target: "https://api.yelp.com/v3/businesses",
					changeOrigin: true }));
};