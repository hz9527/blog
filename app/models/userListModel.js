var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: Number,
	using: {type:Boolean, default: true},
	message: {type: mongoose.Schema.Types.String, ref:'Message'},
	info: {type: mongoose.Schema.Types.String, ref:'UserInfo'},
	limit: {type: mongoose.Schema.Types.String, ref:'DefaultLimit'},
	collect: {type: mongoose.Schema.Types.String, ref:'Collect'},
	fans: {type: mongoose.Schema.Types.String, ref:'Fans'},
});

var User = mongoose.model('User', UserSchema);
