var signCtrl = require('../controllers/signCtrl.js');

module.exports = function(app){
	app.route('/sign')
		.post(signCtrl.create)
		.get(signCtrl.check)
		.put(signCtrl.signIn);
	app.param('uId', function(req, res, next, uId){
		req.uId = uId;
		next();
	})
	app.route('/sign/:uId')
		.get(signCtrl.stopUsing)
		.put(signCtrl.changePwd)
}
