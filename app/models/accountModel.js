var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
	userName: String,
	passWord: String,
	key: [Number],
	uId: {type: mongoose.Schema.Types.Number, ref:'User'}
});

var Account = mongoose.model('Account', AccountSchema);
