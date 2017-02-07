var mongoose = require('mongoose');

var FansSchema = new mongoose.Schema({
	uId: {type: Schema.Types.ObjectId, ref:'User'},
	follower: [
		{
			uId: {type: Schema.Types.ObjectId, ref:'User'},
			createTime: {type: Number, default: Date.now()}
		}
	],
	followe:[
		{
			uId: {type: Schema.Types.ObjectId, ref:'User'},
			createTime: {type: Number, default: Date.now()}
		}
	]
});
var Message = mongoose.model('Message', MessageSchema);
