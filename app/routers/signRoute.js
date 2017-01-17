var signCtrl = require('../controllers/signCtrl.js');

module.exports = function(app){
	app.route('/sign')
		.get(signCtrl.check)
		.post(signCtrl.create)
		.put(signCtrl.signIn);

	app.route('/api/sign')
		.put(signCtrl.changePwd)
		.get(signCtrl.stopUsing);

	// app.param('uId', function(req, res, next, uId){
	// 	req.uId = uId;
	// 	next();
	// })
	// app.route('/api/sign/:uId')
	// 	.get()
	// 	.put()
}
