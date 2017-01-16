var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(){
	var app = express();
	app.use(bodyParser.json());
	app.use(express.static('./static'));

	//导入路由处理并将服务器实例作为参数传入
	require('../app/routers/signRoute.js')(app);

	// 处理所有404情况
	app.use(function(req, res, next){
		console.log(404)
		res.status(404);
		try{
			return res.json('Not Found');
		}catch(e){
			console.error('404 have send');
		}
	});

	// 处理所有500情况
	app.use(function(err, req, res, next){
		if(!err){
			return next();
		}else{
			console.log(500)
			res.status(500);
			try{
				res.json(err.message || 'serve error');
			}catch(e){
				console.error('505 have send');
			}
		}
	});

	return app
}
