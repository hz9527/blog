var mongoose = require('mongoose');
var config = require('./congif.js');

module.exports = function(){
	var db = mongoose.connect(config.mongodb);

	//导入model

	return db;
}
