var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

module.exports = function(){
	var app = express();
	app.use(bodyParser.json());
	app.use(express.static('./static'));
	app.use(cookieParser());

	var mongoose = require('mongoose');
	var userList = mongoose.model('userList');

	//处理所有需要验证身份的api
	app.all('/api/*', function(req, res, next){
		console.log('app.all',req.head,req.cookies);
		var token = req.cookies['token'];
		if(token){
			//验证身份
			userList.findOne({token: token}, function(err,docs){
				if(err){return}
				if(docs){
					if(docs.using === true){
						req.identity = docs.uId;//用户身份，值为id
					}else{
						req.identity = 'log-off';//注销身份
					}
				}else{
					req.identity = 'invaild';//非法身份
				}
				next();
			})
		}else{
			req.identity = 'visiter';//游客身份
			next();
		}
	})

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
