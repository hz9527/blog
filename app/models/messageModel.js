var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
	uId: {type: Schema.Types.ObjectId, ref:'User'},
	messageList: [{
		type: String,
		collectTime: {type: Number, default: Date.now()},
		comment: String
	}],
});
var Message = mongoose.model('Message', MessageSchema);
