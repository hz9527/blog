var mongoose = require('mongoose');
var CollectSchema = new mongoose.Schema({
	uId: {type: Schema.Types.ObjectId, ref:'User'},
	collectList: [{
		bId: String,
		collectTime: {type: Number, default: Date.now()},
		comment: String
	}]
});
var userInfo = mongoose.model('userInfo', UserInfoSchema);
