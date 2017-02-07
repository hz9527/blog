var mongoose = require('mongoose');
var UserInfoSchema = new mongoose.Schema({
	uId: {type:Schema.Types.ObjectId, ref:'User'},
	lId: {type:Schema.Types.ObjectId, ref:'defaultLimit'},
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
var userInfo = mongoose.model('userInfo', UserInfoSchema);
