var mongoose = require('mongoose');
var userList = mongoose.model('userList');

function checkUser(info,cb){//
	userList.find(info,function(err,docs){
		if(err){
			return
		}else{
			console.log(docs)
			cb(docs.length);
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
		checkUser({userName: query}, function(l){
			if(l===0){
				res.send('can signUp');
			}else{
				res.send('have signUp');
			}
		})
	},
	create(req, res, next){//注册接口
		var data = req.body;
		checkUser({userName: data.userName}, function(l){
			if(l===0){
				userList.count({},function(err,count){
					if(err){
						return
					}else{
						var newUser = new userList();
						newUser.userName = data.userName;
						newUser.passWord = data.passWord;
						newUser.uId = count;
						newUser.token = getToken(count);
						newUser.save();
						// 将token以cookie形式返回给客户端
						res.send('signUp');
					}
				})
			}else{
				res.send('have signUp');
			}
		})
	},
	signIn(req, res, next){//登录接口

	},
	stopUsing(req, res, next){//注销接口

	},
	changePwd(req, res, next){//修改密码接口

	}
}
