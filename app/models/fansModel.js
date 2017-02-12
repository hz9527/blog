var mongoose = require('mongoose');

var fList = new mongoose.Schema({
	uId: {type: mongoose.Schema.Types.Number, ref:'User'},
	createTime: {type: Number, default: Date.now()}
})

var FansSchema = new mongoose.Schema({
	_id: String,
	follower: [fList],
	follow:[fList]
});
var Fans = mongoose.model('Fans', FansSchema);
