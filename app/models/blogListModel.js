var mongoose = require('mongoose');

var BlogListSchema = new mongoose.Schema({
	_id: String,//l+i
	limit: Number,
	key: String,
	blog: {type: mongoose.Schema.Types.String, ref:'Blog'},
	comments: {type: mongoose.Schema.Types.String, ref:'Comments'},
	viewCount: Number,
	anonymous: {type: Boolean, default:false},//是否匿名，如果匿名，根据key计算bid，bname与purl
	aId: {type: mongoose.Schema.Types.Number, ref:'User'}
});

var BlogList = mongoose.model('BlogList', BlogListSchema)
