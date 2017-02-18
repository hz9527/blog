var mongoose = require('mongoose');

var fList = new mongoose.Schema({
	_id: String,
	uId: {type: mongoose.Schema.Types.Number, ref:'User'},
	createTime: {type: Number, default: Date.now()}
})

var FansSchema = new mongoose.Schema({
	_id: String,
	followLength: {type: Number, default: 0},
	followerLength: {type: Number, default: 0},
	follower: [fList],
	follow:[fList]
});
FansSchema.methods.relation = function(v,doc,cb){
	var result = {};
	result.follower = this.follower.id(this._id + 'follower' + v) ? true : false;
	result.follow = this.follow.id(this._id + 'follow' + v) ? true : false;
	return cb(null, doc, result)
}
var Fans = mongoose.model('Fans', FansSchema);
