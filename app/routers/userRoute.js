var userCtrl = require('../controllers/userCtrl');

module.exports = function(app){
	app.route('/api/userInfo')
		.get(userCtrl.getUserInfo)
		.post(userCtrl.updateBaseInfo)
}
