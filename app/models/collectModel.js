var mongoose = require('mongoose');
var CollectSchema = new mongoose.Schema({
	uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	collectList: [{
		bId: {type: mongoose.Schema.Types.ObjectId, ref:'BlogList'},
		collectTime: {type: Number, default: Date.now()},
		comment: String
	}]
});
var Collect = mongoose.model('Collect', CollectSchema);
