var mongoose = require('mongoose');

var comments = new mongoose.Schema({
	//具体用户名和头像地址根据计算返回
	back: String,//回复对象id，博客作者或评论作者
	anonymous: {type: Boolean, default:false},//是否匿名，如果匿名，根据key计算bid，bname与purl
	uId: {type: mongoose.Schema.Types.Number, ref:'User'},
	content: String,
	createTime: {type: Number, default: Date.now()}
});

var commentList = new mongoose.Schema({
		list: [comments]
});

var CommentsSchema = new mongoose.Schema({
	_id: String,//c+bid
	limit: Number,//0 self 1 fans 2 follow 3 fans&follow 4 all
	aId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	key: String,
	length: {type: Number, default: 0},
	comments: [commentList]
});
var Comments = mongoose.model('Comments', CommentsSchema);
