var mongoose = require('mongoose');

var DefaultLimitSchema = new mongoose.Schema({
	_id: String,
	publishLimit: {type: Number, default: 5},//0 self 1 fans&follow  2 follow 3 fans 4followOr fans 5 all
	commentLimit: {type: Number, default: 5},
	visitLimit: {type: Number, default: 5},
	infoLimit:{type: Number, default: 3}//0 base(name sex birthday) 1 base+(instroduce)
	//2 base+(introduce duty git blog) 3 all
});

var DefaultLimit = mongoose.model('DefaultLimit', DefaultLimitSchema);
