var mongoose = require('mongoose');
var UserInfoSchema = new mongoose.Schema({
	userId:Number,
	state:{Boolean, default:true},
	name:String,
	sex:String,
	birthday:Number,
	company:String,
	duty:String,
	instroduce:String
});
var userInfo = mongoose.model('userInfo', UserInfoSchema);
