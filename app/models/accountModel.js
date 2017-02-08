var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
	userName: String,
	passWord: String,
	uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

var Account = mongoose.model('Account', AccountSchema);
