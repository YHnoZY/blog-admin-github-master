const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app){
	app.use(
		createProxyMiddleware('/api',{ //遇见/api1前缀的请求，就会触发该代理配置
			target:'http://127.0.0.1:7001', //请求转发给谁
			changeOrigin:true,//控制服务器收到的请求头中Host的值
			pathRewrite:{'^/api':''} //重写请求路径(必须)
		})
	)
}