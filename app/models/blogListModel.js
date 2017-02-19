var mongoose = require('mongoose');

var BlogListSchema = new mongoose.Schema({
	_id: String,//l+i
	limit: Number,
	key: String,
	title: String,//标题
	type: String,//分类
	keyWord: String,//关键词
	viewCount: {type: Number, default:0},
	state: {type:Number, default:0},//状态，默认为删除状态，1为可见，0为不可见
	blog: {type: mongoose.Schema.Types.String, ref:'Blog'},
	comments: {type: mongoose.Schema.Types.String, ref:'Comments'},
	anonymous: {type: Boolean, default:false},//是否匿名，如果匿名，根据key计算bid，bname与purl
	aId: {type: mongoose.Schema.Types.Number, ref:'User'}
});

var BlogList = mongoose.model('BlogList', BlogListSchema)
