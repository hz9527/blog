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
						newMessage.messageList.unshift({
							type:0,
							comment: '欢迎' + data.userName + '注册'
						});

						var newLimit =new defaultLimitList();
						newLimit._id = 'limit' + i;

						var newCollect = new collectList();
						newCollect._id = 'collect' + i;

						newFans.save(function(){
							saveCb();
						});
						newInfo.save(function(){
							saveCb();
						});
						newLimit.save(function(){
							saveCb();
						});
						newMessage.save(function(err){
							console.log(err);
							saveCb();
						});
						newCollect.save(function(){
							saveCb();
						});

						function saveCb(){
							if(++c == 5){
								var newUser = new userList();
								newUser._id = i;
								newUser.message = newMessage._id;
								newUser.info = newInfo._id;
								newUser.collect = newCollect._id;
								newUser.fans = newFans._id;
								newUser.limit = newLimit._id;
								newUser.save(function(err){
									var key = Date.now();
									var newAccount = new accountList();
									newAccount.userName = data.userName;
									newAccount.passWord = data.passWord;
									newAccount.key = key;
									newAccount.uId = newUser._id;
									newAccount.save(function(err){
										// 将token以cookie形式返回给客户端,方便下次登陆验证
										res.cookie('key', newAccount._id, {maxAge: 3600*24*30});
										res.cookie('token', key, {maxAge: 3600*24*30});
										req.session.uId = i;
										res.json({signUp: true, name: data.userName});
									});
								});
							}
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
		accountList.find({userName:data.userName, passWord:data.passWord})
			.populate({
				path:'uId',
				select: '_id message using'
			})
			.exec(function(err, docs){
				if(docs.length == 1 && docs[0].uId.using){
					docs[0].uId.populate({
						path:'message',
						select:'messageList'
					},function(err,doc){
						var key = Date.now();
						docs[0].key = key;
						docs[0].save(function(err){
							res.cookie('key', docs[0]._id, {maxAge: 3600*24*30});
							res.cookie('token', key, {maxAge: 3600*24*30});
							req.session.uId = doc._id;
							res.json({signIn: true, message: doc.message.messageList, messageTime: key});
						});
					});
				}else{//登陆失败
					if(docs.length == 0){
						res.json({signIn: false, message: '用户名或密码错误', messageTime: Date.now()});
					}else if(docs.length == 1 && !docs[0].uId.using){
						res.json({signIn: false, message: '用户已注销', messageTime: Date.now()});
					}
				}
			})
	},
	checkSign(req, res, next){//校验登陆
		var data = req.body;
		//客户端使用cookie key查询，使用token作为cookie过期时间
		accountList.findOne({_id: data.key, key: data.token})
			.populate({
				path:'uId',
				select: '_id message using'
			}).exec(function(err, doc){
				if(doc && doc.uId.using){
					doc.uId.populate({
						path:'message',
						select:'messageList'
					}, function(err, mDoc){
						var key = Date.now();
						doc.key = key;
						doc.save(function(err){
							res.cookie('key', doc._id, {maxAge: key - data.token});
							res.cookie('token', key, {maxAge: key - data.token});
							req.session.uId = mDoc._id;
							res.json({signIn: true, message: mDoc.message.messageList, messageTime: key});
						});
					})
				}else{
					// 客户端清空cookie
					if(!doc){
						res.json({signIn: false, message: '非法登陆', messageTime: Date.now()});
					}else if(!doc.uId.using){
						res.json({signIn: false, message: '用户已注销', messageTime: Date.now()});
					}
				}
			})
	},
	stopUsing(req, res, next){//注销接口
		// if(typeof req.identity !=='number'){
		// 	res.json({stopUsing: false, message:req.identity});
		// 	return
		// }
		// userList.findOneAndUpdate({uId: req.identity }, {$set: {using: false}}, function(err, docs){
		// 	if(err){return}
		// 	if(docs.uId){
		// 		//将所有发布博客，个人信息置为不可用状态
		// 		res.json({stopUsing: true, message:''})
		// 	}else{
		// 		res.json({stopUsing: false, message:'未找到该用户'})
		// 	}
		// });
		//add
		// messageList.findOneAndUpdate({},{$push:{
		// 	'messageList':{
		// 		type:0,
		// 		comment: '欢迎back'
		// 	}
		// }},function(err,doc){
		// 	console.log(err,doc);
		// 	res.end();
		// })
		//update
		// messageList.findOne({},function(err,doc){
		// 	doc.messageList[1].read = true;
		// 	doc.save();
		// })
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
