var mongoose = require('mongoose');
var fansList = mongoose.model('Fans');
var messageList = mongoose.model('Message');
var defaultLimitList = mongoose.model('DefaultLimit');
var userList = mongoose.model('User');

module.exports = {
	followOther(req, res, next){
		var follow = req.body.follow;
		if(follow == req.identity){
			res.json({state: false, message:'不能关注自己'});
			return
		}
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		userList.findOne({_id: follow, using:true})
			.populate({
				path:'fans message',
				match:{
					'follower.uId':{
						$nin:[req.identity]
					}
				}
			})
			.exec(function(err, doc){
				if(doc && doc.fans){
					doc.fans.update({
						$push:{
							'follower':{'_id': doc.fans._id + 'follower' + req.identity,'uId':req.identity}
						},
						$inc:{followerLength:1}
					},function(err,result){
						if(!err){
							userList.findOne({_id: req.identity, using:true})
								.populate({
									path:'fans info',
									match:{
										'follow.uId':{
											$nin:[follow]
										}
									}
								})
								.exec(function(err, uDoc){
									if(uDoc && uDoc.fans){
										uDoc.fans.update({
											$push:{
												'_id': uDoc.fans._id + 'follow' + req.identity,
												'follow':{'uId': follow}
											},
											$inc:{followLength:1}
										},function(err){
											if(!err){
												res.json({state: true, message:'关注成功'})
											}
										});
										doc.message.update({$push:{'messageList':{
											type: 3,
											comment:'新增粉丝' + uDoc.info.name
										}}},function(err){
											console.log('messageOfAddFans:' + err);
										})
									}else{
										res.json({state: false, message:'关注失败'})
									}
								});
						}
					});
				}else{
					if(doc){
						res.json({state: false, message:'已关注该用户'});
					}else{
						res.json({state: false, message:'该用户不存在或已注销'});
					}
				}
			})
	},
	unFollow(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var unFollow = req.body.unFollow;
		userList.findOne({_id: req.identity, using: true})
			.populate({
				path:'fans',
				match:{
					'follow.uId':unFollow
				}
			})
			.exec(function(err, doc){
				if(doc && doc.fans && doc.fans.follow){
					doc.fans.update({
						$pull:{'follow': doc.fans.follow[0]},
						$inc:{'followLength': -1}
					},function(err, result){
						if(!err){
							fansList.findByIdAndUpdate(
								{_id: 'fans' + unFollow},
								{
									$pull:{'follower': {$in:{'uId': req.identity}}},
									$inc:{'followerLength':-1}
								},
								function(err,fDoc){
									if(!err){
										res.json({state: true, message:'取消关注成功'});
									}else{
										console.log('unFollow:'+ err)
										res.json({state: false, message:'取消关注失败'});
									}
								});
						}else{
							res.json({state: false, message:'取消关注失败'});
						}
					});
				}else{
					res.json({state: false, message:'用户不在关注列表中'});
				}
			})
	}
}
