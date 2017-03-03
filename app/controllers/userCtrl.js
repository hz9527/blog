var mongoose = require('mongoose');
var fansList = mongoose.model('Fans');
var infoList = mongoose.model('UserInfo');
var messageList = mongoose.model('Message');
var defaultLimitList = mongoose.model('DefaultLimit');
var userList = mongoose.model('User');
var infoConfig = [
	['name', 'sex', 'birthday', 'picture'],
	['name', 'sex', 'birthday', 'picture', 'introduce', 'createTime'],
	['name', 'sex', 'birthday', 'picture', 'introduce', 'createTime', 'duty', 'git', 'blog'],
	['name', 'sex', 'birthday', 'picture', 'introduce', 'createTime', 'duty', 'git', 'blog', 'company']
]

module.exports = {
	//更改基本信息
	updateBaseInfo(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var data = req.body;
		infoList.findByIdAndUpdate({_id: 'info' + req.identity},
			{
				$set: data.info
			},
			function(err, doc){
				if(doc){
					res.json({state: true, message:'修改成功'});
				}else{
					res.message = '未找到该用户';
					next();
				}
		});
	},
	//获取主页信息
	getUserInfo(req, res, next){//查看他人主页信息
		var own = req.query.user;
		if(!own){//查看自己主页
			if(typeof req.identity !=='number'){
				res.json({state: false, message:req.identity});
				return
			}else{
				var selectStr = infoConfig[3].join(' ') + ' followLength followerLength publishLimit commentLimit visitLimit infoLimit -_id';
				userList.findById({_id: req.identity})
					.populate({
						path: 'info fans limit',
						select: selectStr
					})
					.exec(function(err, doc){
						res.json({state: false, message:'获取数据成功', data:{
							info: doc.info,
							fans: doc.fans,
							limit: doc.limit
						}});
					})
			}
		}else{
			var selectStr;
			if(own == req.identity){//访问自己主页
				selectStr = infoConfig[3].join(' ') + ' followLength followerLength -_id';
				userList.findById({_id: req.identity})
					.populate({
						path: 'info fans limit',
						select: selectStr
					})
					.exec(function(err, doc){
						var fans = {
							follow: doc.fans.followLength,
							follower: doc.fans.followerLength,
							relation: 'self'
						}
						res.json({state: true, message:'获取数据成功', data:{
							info: doc.info,
							fans: fans
						}});
					})
			}else{//访问他人主页主页
				userList.findOne({_id: own, using:true})
					.populate({
						path: 'limit',
						select: 'visitLimit infoLimit -_id'
					})
					.exec(function(err, doc){
						if(doc){
							var v = doc.limit.visitLimit;
							if(typeof req.identity !=='number'){
								if(v == 5){//游客访问主页
									selectStr = infoConfig[doc.limit.infoLimit].join(' ') + ' followLength followerLength -_id';
									doc.populate({
										path:'fans info',
										select: selectStr
									}, function(err, doc){
										var fans = {
											follow: doc.fans.followLength,
											follower: doc.fans.followerLength,
											relation: req.identity
										}
										res.json({state: true, message: '获取信息成功', data:{info: doc.info, fans: fans}});
									})
								}else{
									res.json({state: false, message:'无权限访问'});
								}
							}else{//用户访问他人主页
								doc.populate('fans',function(err, doc){
									doc.fans.relation(req.identity,doc,function(err, doc, result){
										if(v == 5 || (v == 4 && (result.follow || result.follower)) || (v == 3 && result.follower) ||
											(v == 2 && result.follow) || (v == 1 && result.follow && result.follower)){
												selectStr = infoConfig[doc.limit.infoLimit].join(' ') + ' -_id';
												doc.populate({
													path: 'info',
													select: selectStr
												}, function(err, doc){
													var fans = {
														follow: doc.fans.followLength,
														follower: doc.fans.followerLength,
														relation: result
													}
													res.json({state: true, message: '获取信息成功', data:{info: doc.info, fans: fans}});
												})
										}else{
											res.json({state: false, message:'无权限访问'});
										}
									})
								});
							}
						}else{
							res.json({state: false, message:'访问用户不存在'});
						}
					});
			}
		}
	},
	//更改默认权限
	changeDefaultLimit(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var data = req.body;
		defaultLimitList.findByIdAndUpdate({_id: 'limit' + req.identity},
		{$set:data.limit},
		function(err, doc){
			if(doc){
				res.json({state: true, message:'修改成功'});
			}else{
				res.json({state: false, message:'未找到该用户'});
			}
		});
	},
	//获取消息列表
	// getMessageList(req, res, next){
	// 	if(typeof req.identity !=='number'){
	// 		res.json({state: false, message:req.identity});
	// 		return
	// 	}
	// 	var data = req.body;
	// 	messageList.findById({_id:'message' + req.identity},function(err, doc){
	// 		if(doc){
	// 			doc.getLastList(data.condition,data.option,'',function(err,docs,pi){
	// 				var resData = {};
	// 				resData.messageList = docs;
	// 				// resData.unRead0 = doc.unRead0;
	// 				// resData.unRead1 = doc.unRead1;
	// 				// resData.unRead2 = doc.unRead2;
	// 				// resData.unRead3 = doc.unRead3;
	// 				pi && (resData.pageInfo = pi);
	// 				res.json({state: true, message:'获取消息成功', data:resData});
	// 			})
	// 		}else{
	// 			res.message='查询出错';
	// 			next();
	// 		}
	// 	})
	// },
	getMessageList(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var data = req.body;//condition[{key:'type',value:xx,result:0,1,-1,-0.5,0.5}]page{page:xx,pageSize}
		messageList.findById({_id:'message' + req.identity},function(err, doc){
			if(doc){
				var condition;
				if(data.condition){
					 condition = function(item){
						return	data.condition.every(function(i){
											var result;
											switch(i.result){
												case 0:
													result = i.value - item[i.key] == 0 ? true : false;
												case -1:
													result = i.value - item[i.key] > 0 ? true : false;
												case 1:
													result = i.value - item[i.key] < 0 ? true : false;
												case -0.5:
													result = i.value - item[i.key] >= 0 ? true : false;
												case 0.5:
													result = i.value - item[i.key] <= 0 ? true : false;
											}
											return result
										})
					}
				}

				var result = doc.getLastList(condition, data.page || null);
				res.json({state: true, message:'获取消息成功', data:result});
			}else{
				res.message='查询出错';
				next();
			}
		})
	},
	// 读取消息
	readMessage(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var data = req.body.readList;
		messageList.findOne({_id: 'message' + req.identity},function(err, doc){
			if(doc){
				// console.log(doc.messageList.indexOf(doc.messageList.id(readId)));
				// doc.messageList.id(readId).read = true;
				for(var i=0;i<data.length;i++){
					if(!doc.messageList[data[i]].read){
						var type = doc['unRead'+ doc.messageList[data[i]].type];
						doc.messageList[data[i]].read = true;
						doc['unRead'+ type] = doc['unRead'+ type] - 1;
					}
					i==data.length-1 && doc.save(function(err){
						if(!err){
							res.json({state: true, message:'消息已读成功'});
						}else{
							res.message='数据库错误';
							next();
						}
					})
				}
			}else{
				res.message='查询出错';
				next();
			}
		})
	},
	//查询消息数
	getMessageCount(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		messageList.findById('message' + req.identity,'unRead0 unRead1 unRead2 unRead3 -_id',function(err,doc){
			if(doc){
				req.session.uId = req.identity;
				res.json({state: true, message:'获取未读消息数成功', data:[doc.unRead0,doc.unRead1,doc.unRead2,doc.unRead3]})
			}else{
				res.message='查询出错';
				next();
			}

		})
	}
}

// $or:[
// 	{
// 		$and:[
// 			{'visitLimit': 4},//visitLimit为4
// 			{'_id': 'fans'+own},
// 			{'_id': 'info'+own}
// 		]
// 	},
// 	{
// 		$and:[
// 			{'visitLimit':3},
// 			{$or:[
// 				{'follower.uId': req.identity},
// 				{'follow.uId': req.identity}
// 			]},
// 			{'_id': 'info'+own}
// 		]
// 	},//visitLimit为3，且用户存在于粉丝列表或关注列表中
// 	{
// 		$and:[
// 			{'visitLimit': 2},
// 			{'follower': req.identity},
// 			{'_id': 'info'+own}
// 		]
// 	},//visitLimit为2，且用户存在于关注列表中
// 	{
// 		$and:[
// 			{'visitLimit': 1},
// 			{'follow': req.identity},
// 			{'_id': 'info'+own}
// 		]
// 	},//visitLimit为1，且用户存在于粉丝列表中
// ]
