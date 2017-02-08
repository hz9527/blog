var mongoose = require('mongoose');

var BlogListSchema = new mongoose.Schema({
	_id: String,
	limit: Number,
	key: String,
	fans: {type: mongoose.Schema.Types.ObjectId, ref:'Fans'},
	blog: {type: mongoose.Schema.Types.ObjectId, ref:'Blog'},
	comments: {type: mongoose.Schema.Types.ObjectId, ref:'Comments'},
	viewCount: Number,
	bName: String,
	bId: String,
	aId: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

var BlogList = mongoose.model('BlogList', BlogListSchema)
