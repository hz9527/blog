var mongoose = require('mongoose');

var defaultLimitSchema = new mongoose.Schema({
	uId: {type:Schema.Types.ObjectId, ref:'User'},
	publishLimit: {type: Number, default: 4},//0 self 1 fans 2 follow 3 fans&follow 4 all
	commentLimit: {type: Number, default: 4},
	visitLimit: {type: Number, default: 4},
	infoLimit:{type: Number, default: 3}//0 base(name sex birthday) 1 base+(instroduce)
	//2 base+(introduce duty git blog) 3 all
});

var defaultLimit = mongoose.model('defaultLimit', defaultLimitSchema);
