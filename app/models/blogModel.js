var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema({
	_id: String,//b+bid
	content: String,
	updateTime: {type: Number, default: Date.now()},
	createTime: {type: Number, default: Date.now()}
});

var Blog = mongoose.model('Blog', BlogSchema);
