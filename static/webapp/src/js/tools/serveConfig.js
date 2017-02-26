var domain = 'http://127.0.0.1:18003'
module.exports = {
	checkSign: {
		method: 'post',
		url: domain + '/api/sign'
	},
	message: {
		method: 'get',
		url: domain + '/api/message',
		time: 60*1000*5
	},
	checkUser: {
		method: 'get',
		url: domain + '/sign'
	},
	signIn: {
		method: 'put',
		url: domain + '/sign'
	},
	signUp: {
		method: 'post',
		url: domain + '/sign'
	}
}
