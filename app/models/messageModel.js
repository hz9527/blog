var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
	_id: String,
	messageList: [{
		type: Number,//0系统消息，1评论回复，2博客被评论，3新增粉丝
		read: {type: Boolean, default: false}
		collectTime: {type: Number, default: Date.now()},
		comment: String
	}],
});
var Message = mongoose.model('Message', MessageSchema);
