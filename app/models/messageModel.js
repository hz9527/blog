var mongoose = require('mongoose');

var messageList = new mongoose.Schema({
	_id: Number,
	type: Number,//0系统消息，1评论回复，2博客被评论，3新增粉丝
	read: {type: Boolean, default: false},
	createTime: {type: Number, default: Date.now()},
	comment: String
});

var MessageSchema = new mongoose.Schema({
	_id: String,
	unRead0: {type: Number, default:0},
	unRead1: {type: Number, default:0},
	unRead2: {type: Number, default:0},
	unRead3: {type: Number, default:0},
	messageLength:{type: Number, default:0},
	messageList: [messageList],
});

MessageSchema.methods.getLastList = function(condition, option, doc, cb){
	//condition {createTime:xx, read:xx, type:xx}非必填
	//option {skip:xx,limit:xx}非必填
	var ct = 0,read = -1,type = -1,si = -1,rl,result,c,ps,pi;
	if(condition){
		condition.createTime && (ct = condition.createTime);
		condition.read && (read = condition.createTime);
		condition.type && (type = condition.type);
	}
	if(option){
		option.skip > 0 && (si = option.skip);
		option.skip == -1 && (si= this.messageList.length-1);
		option.limit > 0 && (rl = option.limit);
	}else{
		option = {}
	}
	if(ct == 0 && read == -1 && type == -1 && si == -1 && !rl){
		return cb(null, doc ? doc : this.messageList.reverse());
	}
	result = [];
	c = 0;
	ps = 0;
	if(option.skip == -1 && rl){
		for(var i= si ; i>= 0 ;){
				var item = this.messageList[i];
				if(item.createTime > ct && (read == -1 || item.read == read) && (type == -1 || item.type == type)){
					c<rl&&result.push(item);
					c++;
					c==rl&&(si=i-1);
					ps++;
				}
				i--;
		}
		pi={skip:si,totalPage:Math.ceil(ps/rl)};
	}else{
		for(var i= si ; i>= 0 ;){
				var item = this.messageList[i];
				if(item.createTime > ct && (read == -1 || item.read == read) && (type == -1 || item.type == type)){
					result.push(item);
					rl && c++;
				}
				i--;
				if(rl && c == rl)break;
		}
		pi={skip:i}
	}
	return cb(null, doc ? doc : result, option.skip ? pi : null);
}

var Message = mongoose.model('Message', MessageSchema);
