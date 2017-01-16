var mongoose = require('mongoose');

var UserListSchema = new mongoose.Schema({
	userName: String,
	passWord: String,
	uId: Number,
	token: String,
	using: {type:Boolean, default: true},
	createTime: {type: Number, default: Date.now()}
});

var userList = mongoose.model('userList', UserListSchema);
