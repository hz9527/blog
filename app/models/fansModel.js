var mongoose = require('mongoose');

var FansSchema = new mongoose.Schema({
	_id: String,
	follower: [
		{
			uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
			createTime: {type: Number, default: Date.now()}
		}
	],
	followe:[
		{
			uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
			createTime: {type: Number, default: Date.now()}
		}
	]
});
var Fans = mongoose.model('Fans', FansSchema);
