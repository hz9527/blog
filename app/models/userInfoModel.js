var mongoose = require('mongoose');
var UserInfoSchema = new mongoose.Schema({
	_id: String,
	name: String,
	picture: String,
	sex: String,
	birthday: Number,
	company: String,
	duty: String,
	instroduce: String,
	git: String,
	blog: String,
	createTime: {type: Number, default: Date.now()}
});
var UserInfo = mongoose.model('UserInfo', UserInfoSchema);
