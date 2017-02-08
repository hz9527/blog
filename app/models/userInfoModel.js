var mongoose = require('mongoose');
var UserInfoSchema = new mongoose.Schema({
	uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	lId: {type: mongoose.Schema.Types.ObjectId, ref:'defaultLimit'},
	name: String,
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
