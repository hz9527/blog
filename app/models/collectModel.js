var mongoose = require('mongoose');
var CollectSchema = new mongoose.Schema({
	_id: String,
	collectList: [{
		bId: {type: mongoose.Schema.Types.ObjectId, ref:'BlogList'},
		collectTime: {type: Number, default: Date.now()},
		comment: String
	}]
});
var Collect = mongoose.model('Collect', CollectSchema);
