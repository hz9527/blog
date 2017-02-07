var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
	userName: String,
	passWord: String,
	uId: {type:Schema.Types.ObjectId, ref:'User'}
});

var Account = mongoose.model('Account', AccountSchema);
