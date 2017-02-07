var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: Number,
	name: String,
	picture: String,
	using: {type:Boolean, default: true}
});

var User = mongoose.model('User', UserSchema);
