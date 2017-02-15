var mongoose = require('mongoose');
var fansList = mongoose.model('Fans');
var infoList = mongoose.model('UserInfo');
// var messageList = mongoose.model('Message');
var defaultLimitList = mongoose.model('DefaultLimit');
var userList = mongoose.model('User');


module.exports = {
	//更改基本信息
	updateBaseInfo(req, res, next){
		if(typeof req.identity !=='number'){
			res.json({state: false, message:req.identity});
			return
		}
		var data = req.body;
		console.log(data.info,data)
		infoList.findByIdAndUpdate({_id: 'info' + req.identity},
			{
				$set: data.info
			},
			function(err, doc){
				console.log(err,doc)
				if(doc){
					res.json({state: true, message:'修改成功'});
				}else{
					res.json({state: false, message:'未找到该用户'});
				}
		});
	},
	//获取主页信息
	getUserInfo(req, res, next){
		var own = req.query.user;
		if(!own){
			res.json({state: false, message:req.identity});
			return
		}
		if(own == req.identity){
			userList.findById({_id: req.identity})
				.populate({
					path: 'info fans limit',
					select:'name picture sex birthday company duty instroduce git blog createTime followLength followerLength publishLimit commentLimit visitLimit infoLimit -_id'
				})
				.exec(function(err, doc){
					res.json({state: false, message:'获取数据成功', data:{
						info: doc.info,
						fans: doc.fans,
						limit: doc.limit
					}});
				})
		}else{
			userList.findById({_id: own})//>>>>>>>>>>>>>>>>
				.populate({
					path: 'info fans limit',
					match:{
						'info.follow':{
							$in: [req.identity]
						}
					},
					select:'name picture sex birthday company duty instroduce git blog createTime followLength followerLength infoLimit -_id'
				})
				.exec(function(err, doc){
					console.log(err, doc);
					res.end();
				})
		}

	}
	//查看他人主页信息
	//更改默认权限
}
