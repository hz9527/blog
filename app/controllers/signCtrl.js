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
						newInfo._id = 'info' + i;
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
									newAccount.key.push(key);
									newAccount.uId = newUser._id;
									newAccount.save(function(err){
										// 将token以cookie形式返回给客户端,方便下次登陆验证
										res.cookie('key', newAccount._id, {maxAge: 3600*24*30*1000});
										res.cookie('token', key, {maxAge: 3600*24*30*1000});
										req.session.uId = i;
										res.json({
											signUp: true,
											name: data.userName,
											pic: newInfo.picture
										});
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
				select: '_id message info using'
			})
			.exec(function(err, docs){
				if(docs.length == 1 && docs[0].uId.using){
					docs[0].uId.populate({
						path:'info message',
						select:'messageList picture name  -_id'
					},function(err,doc){
						var key = Date.now();
						docs[0].key.length > 4 ? (docs[0].key.$pop() && docs[0].key.push(key)) : docs[0].key.push(key);
						docs[0].save(function(err){
							res.cookie('key', docs[0]._id, {maxAge: 3600*24*30*1000});
							res.cookie('token', key, {maxAge: 3600*24*30*1000});
							req.session.uId = doc._id;
							res.json({
								signIn: true,
								message: doc.message.messageList,
								messageTime: key,
								name: doc.info.name,
								picture: doc.info.picture
							});
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
		var cookie = req.cookies;
		//客户端使用cookie key token查询，客户端传入最近消息时间戳，方便服务器返回消息列表
		accountList.findOne({_id: cookie.key, key:{
			$in:[cookie.token]
		}})
			.populate({
				path:'uId',
				select: '_id message info using'
			}).exec(function(err, doc){
				if(doc && doc.uId.using){
					doc.uId.populate({
						path:'message info',
						select:'messageList picture name -_id'
					}, function(err, mDoc){
						req.session.uId = mDoc._id;
						res.json({
							signIn: true,
							message: mDoc.message.messageList,
							messageTime: Date.now(),
							name: mDoc.info.name,
							picture: mDoc.info.picture
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
	stopUsing(req, res, next){//注销接口,后续可增加注销是否清空博客数据选项
		if(typeof req.identity !=='number'){
			res.json({stopUsing: false, message:req.identity});
			return
		}
		userList.findByIdAndUpdate({_id: req.identity }, {$set: {using: false}}, function(err, doc){
			if(err){return}
			if(doc){
				res.json({stopUsing: true, message:'注销成功'})
			}else{
				res.json({stopUsing: false, message:'未找到该用户'})
			}
		});
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
		var token = Date.now();
		accountList.findOneAndUpdate({userName: data.userName, passWord: data.passWord, uId: req.identity},
			{
				$set: {passWord: data.newPassWord, key: [token]},
				// $push:{key: token}
			}, function(err, doc){
			if(err){return}
			if(doc){
				res.cookie('key', doc._id, {maxAge: 3600*24*30*1000});
				res.cookie('token', token, {maxAge: 3600*24*30*1000});
				res.json({changePwd: true, message:'修改成功'});
			}else{
				res.json({changePwd: false, message:'未找到该用户'})
			}
		});
	}
}
