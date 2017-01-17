var mongoose = require('mongoose');
var userList = mongoose.model('userList');

function findOne(conditions,cb){//
	userList.find(conditions, function(err,docs){
		if(err){
			return
		}else{
			cb(docs);
		}
	})
}

function findAndUpdate(conditions, newDoc,cb){
	userList.findOneAndUpDate(conditions, {$set: newDoc}, function(err, docs){
		if(err){
			return
		}else{
			cb(docs)
		}
	})
}

var abc=['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
'o','p','q','r','s','t','u','v','w','x','x','z','_','?','*','-'];

function getToken(uid){//随机生成uId＋10为长度随机的token
	var result='';
	while(result.length < 10){
		if(Math.random() < 0.5){
			result += parseInt(Math.random()*10);
		}else{
			result += abc[parseInt(Math.random()*30)]
		}
	}
	return uid + '+' + result;
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
				//查询消息数并返回结果，将以下返回作为回调
				//设置cookie
				var token = getToken(docs.uId);
				res.cookie('token', token, {maxAge: 3600*24*7});
				docs.token = token;
				docs.save();
				res.json({sign: true});
			}else{
				res.json({sign: false});
			}
		})
	},
	stopUsing(req, res, next){//注销接口
		var data = req.body;
		console.log('im here', req.identity);
		res.end();
	},
	changePwd(req, res, next){//修改密码接口
		console.log(arguments);
	}
}
