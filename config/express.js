var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var uidKey = require('./uidKey.js');

module.exports = function(){
	var app = express();
	app.use(bodyParser.json());
	app.use(express.static('../static'));
	app.use(cookieParser());
	app.use(session({
		secret:'9527',
		name:'hz',
		cookie:{maxAge:60*1000*10},
		reload:true,
		rolling:true
	}));

	var mongoose = require('mongoose');
	//var userList = mongoose.model('userList');

	//设置跨域访问
	app.all('*', function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	    res.header("X-Powered-By",' 3.2.1')
	    res.header("Content-Type", "application/json;charset=utf-8");
	    next();
	});

	//处理所有需要验证身份的api
	app.all('/api/*', function(req, res, next){
		var uId,vId;
		uId = req.session.uId;
		console.log(uId)
		// var cId = uidKey.getUid(req.cookies.cId);//游客

		if(uId || vId){
			//验证身份
			if(vId){
				req.identity = vId;//返回有记录游客id
			}
			if(uId){
				req.identity = uId;//返回用户id
			}
			next();
		}else{
			req.identity = 'visiter';//普通游客身份
			next();
		}
	})

	//导入路由处理并将服务器实例作为参数传入
	require('../app/routers/signRoute.js')(app);

	require('../app/routers/userRoute.js')(app);

	// 处理所有404情况
	app.use(function(req, res, next){
		console.log(404);
		res.status(404);
		res.json({state: 404, message:res.message})
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
			console.log(500,err)
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
