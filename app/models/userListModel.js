var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: Number,
	using: {type:Boolean, default: true},
	message: {type: mongoose.Schema.Types.ObjectId, ref:'Message'},
	info: {type: mongoose.Schema.Types.ObjectId, ref:'UserInfo'},
	limit: {type: mongoose.Schema.Types.ObjectId, ref:'DefaultLimit'},
	collect: {type: mongoose.Schema.Types.ObjectId, ref:'Collect'},
	fans: {type: mongoose.Schema.Types.ObjectId, ref:'Fans'},
});

var User = mongoose.model('User', UserSchema);
