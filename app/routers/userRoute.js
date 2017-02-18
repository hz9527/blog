var userCtrl = require('../controllers/userCtrl');
var followCtrl = require('../controllers/followCtrl');

module.exports = function(app){
	app.route('/api/userInfo')
		.get(userCtrl.getUserInfo)//
		.post(userCtrl.updateBaseInfo)//
		.put(userCtrl.changeDefaultLimit)

	app.route('/api/follow')
		.post(followCtrl.followOther)//
		.put(followCtrl.unFollow)

	app.route('/api/message')
		.get(userCtrl.getMessageCount)
		.post(userCtrl.getMessageList)
		.put(userCtrl.readMessage)
}
