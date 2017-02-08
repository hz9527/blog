var mongoose = require('mongoose');

var userList = mongoose.model('User');
var accountList = mongoose.model('Account');
var fansList = mongoose.model('Fans');
var messageList = mongoose.model('Message');
var defaultLimitList = mongoose.model('DefaultLimit');
var collectList = mongoose.model('Collect');

var pictureList = require('../../config/defaultPicture.js');

var common = require('./common/common.js');

function findOne(conditions,cb){//
	userList.find(conditions, function(err,docs){
		if(err){
			return
		}else{
			cb(docs);
		}
	})
}

function getToken(uid){//随机生成uId＋10为长度随机的token
	return uid + '+' + common.getToken();
}

module.exports = {
	check(req, res, next){//检查账号是否可用接口
		var query = req.query.userName;
		userList.count({userName: query}, function(err, l){
			if(err){return}
			if(l===0){
				res.json({canSignUp: true});
			}else{
				res.json({canSignUp: false});
			}
		})
	},
	create(req, res, next){//注册接口
		var data = req.body;
		userList.count({userName: data.userName}, function(err, l){
			if(err){return}
			if(l===0){
				userList.count({},function(err,count){//根据count分配ID
					if(err){
						return
					}else{
						// 更新用户表，账户表，新建粉丝表，消息表，默认权限表，收藏表；设置session及token
						var newUser = new userList();
						newUser._id = count+1;
						newUser.name = data.userName;
						newUser.picture = pictureList[parseInt(pictureList.length*Math.random())];

						var token = getToken(count+1);
						var newUser = new userList();
						newUser.userName = data.userName;
						newUser.passWord = data.passWord;
						newUser.uId = count+1;
						newUser.token = token;
						newUser.save();
						// 将token以cookie形式返回给客户端
						res.cookie('token', token, {maxAge: 3600*24*7});
						res.json({signUp: true, name: data.userName});
					}
				})
			}else{
				res.json({signUp: false, name: null});
			}
		})
	},
	signIn(req, res, next){//登录接口
		var data = req.body;
		findOne({$and: [{userName: data.userName, passWord: data.passWord}]}, function(docs){
			if(docs.length == 1){
				//如果使用状态为false直接返回
				if(docs[0].using === false){
					res.json({sign: false, message:'用户已注销'})
				}else{
					var token = getToken(docs[0].uId);
					userList.findOneAndUpdate({uId: docs[0].uId}, {$set: {token: token}}, function(err){
						if(err){return}
						//查询消息数并返回结果，将以下返回作为回调
						//设置cookie
						res.cookie('token', token, {maxAge: 3600*24*7});
						res.json({sign: true, message:''});
					})
				}
			}else{
				res.json({sign: false, message:'用户未注册或密码不正确'});
			}
		})
	},
	stopUsing(req, res, next){//注销接口
		if(typeof req.identity !=='number'){
			res.json({stopUsing: false, message:req.identity});
			return
		}
		userList.findOneAndUpdate({uId: req.identity }, {$set: {using: false}}, function(err, docs){
			if(err){return}
			if(docs.uId){
				//将所有发布博客，个人信息置为不可用状态
				res.json({stopUsing: true, message:''})
			}else{
				res.json({stopUsing: false, message:'未找到该用户'})
			}
		});
	},
	changePwd(req, res, next){//修改密码接口
		if(typeof req.identity !=='number'){
			res.json({changePwd: false, message:req.identity});
			return
		}
		var data = req.body;
		var token = getToken(req.identity);
		userList.findOneAndUpdate({uId: req.identity }, {$set: {passWord: data.passWord, token:token}}, function(err, docs){
			if(err){return}
			if(docs.uId){
				res.cookie('token', token, {maxAge: 3600*24*7});
				res.json({changePwd: true, message:''})
			}else{
				res.json({changePwd: false, message:'未找到该用户'})
			}
		});
	}
}
