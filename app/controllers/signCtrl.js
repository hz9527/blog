var mongoose = require('mongoose');

var userList = mongoose.model('User');
var accountList = mongoose.model('Account');
var fansList = mongoose.model('Fans');
var infoList = mongoose.model('UserInfo');
var messageList = mongoose.model('Message');
var defaultLimitList = mongoose.model('DefaultLimit');
var collectList = mongoose.model('Collect');

var pictureList = require('../../config/defaultPicture.js');

var common = require('./common/common.js');

function saveNewUser(i, cb){
	var newUser = new userList();
	newUser._id = i;
	newUser.message = 'message' + i;
	newUser.info = 'info' + i;
	newUser.collect = 'collect' + i;
	newUser.fans = 'fans' + i;
	newUser.limit = 'limit' +i;
	newUser.save(cb);
}

module.exports = {
	check(req, res, next){//检查账号是否可用接口
		var query = req.query.userName;
		accountList.count({userName: query}, function(err, l){
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
		accountList.count({userName: data.userName}, function(err, l){
			if(err){return}
			if(l===0){
				accountList.count({},function(err,count){//根据count分配ID
					if(err){
						return
					}else{
						// 更新用户表，账户表，新建粉丝表，消息表，默认权限表，收藏表；设置session及token
						var i = count + 1;
						var c = 0;
						var newFans = new fansList();
						newFans._id = 'fans' + i;

						var newInfo = new infoList();
						newInfo.Id = 'info' + i;
						newInfo.name = data.userName;
						newInfo.picture = pictureList[parseInt(pictureList.length*Math.random())];

						var newMessage = new messageList();
						newMessage._id = 'message' + i;

						var newLimit =new defaultLimitList();
						newLimit._id = 'limit' + i;

						var newCollect = new collectList();
						newCollect._id = 'collect' + i;

						newFans.save(function(){
							(++c == 5) && saveCb();
						});
						newInfo.save(function(){
							(++c == 5) && saveCb();
						});

						newLimit.save(function(){
							(++c == 5) && saveCb();
						});
						newMessage.save(function(){
							(++c == 5) && saveCb();
						});
						newCollect.save(function(){
							(++c == 5) && saveCb();
						});

						function saveCb(){
							saveNewUser(i, function(){
								var newAccount = new accountList();
								newAccount.name = data.userName;
								newAccount.password = data.passWord;
								newAccount.uId = i;
								newAccount.save(function(){
									// 将token以cookie形式返回给客户端
									// res.cookie('token', token, {maxAge: 3600*24*7});
									res.json({signUp: true, name: data.userName});
								})
							})
						}

					}
				})
			}else{
				res.json({signUp: false, name: null});
			}
		})
	},
	signIn(req, res, next){//登录接口
		var data = req.body;
		accountList.find({$and: [{userName: data.userName, passWord: data.passWord}]})
			.populate({
				path: 'uId',
				select: 'using'
			})
			.exec(function(err,docs){
				if(docs.length == 1){
					//如果使用状态为false直接返回
					if(docs[0].uId.using === false){
						res.json({sign: false, message:'用户已注销'})
					}else{
						//查询消息数并返回结果，将以下返回作为回调
						//设置cookie
						res.cookie('token', token, {maxAge: 3600*24*7});
						res.json({sign: true, message:''});
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
