var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function(){
	var db = mongoose.connect(config.mongodb);

	//导入model
	require('../app/models/userListModel.js');
	return mongoose;
}
