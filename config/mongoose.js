var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function(){
	var db = mongoose.connect(config.mongodb);

	//导入model
	require('../app/models/userListModel.js');
	require('../app/models/userInfoModel.js');
	require('../app/models/messageModel.js');
	require('../app/models/fansModel.js');
	require('../app/models/defaultLimitModel.js');
	require('../app/models/commentsModel.js');
	require('../app/models/collectModel.js');
	require('../app/models/blogModel.js');
	require('../app/models/blogListModel.js');
	require('../app/models/accountModel.js');

	return mongoose;
}
