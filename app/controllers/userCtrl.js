var mongoose = require('mongoose');
var fansList = mongoose.model('Fans');
var infoList = mongoose.model('UserInfo');
// var messageList = mongoose.model('Message');
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
					res.json({state: false, message:'未找到该用户'});
				}
		});
	},
	//获取主页信息
	getUserInfo(req, res, next){//查看他人主页信息
		var own = req.query.user;
		if(!own){
			res.json({state: false, message:req.identity});
			return
		}
		var selectStr;
		if(own == req.identity){
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
		}else{
			userList.findOne({_id: own, using:true})
				.populate({
					path: 'limit',
					select: 'visitLimit infoLimit -_id'
				})
				.exec(function(err, doc){
					if(doc){
						var v = doc.limit.visitLimit;
						if(typeof req.identity !=='number'){
							if(v == 5){
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
						}else{
							doc.populate('fans',function(err, doc){
								doc.fans.relation(req.identity,doc,function(err, doc, result){
									console.log(doc.fans,doc,333)
									// doc.fans.follow = null;
									// doc.fans.follower = null;
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
