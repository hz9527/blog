var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
	_id: String,
	comments: [
		{
			back: String,
			uId: {type: Schema.Types.ObjectId, ref:'User'},
			createTime: {type: Number, default: Date.now()}
		}
	]
});
var Message = mongoose.model('Message', MessageSchema);
