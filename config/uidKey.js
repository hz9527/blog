var config = require('./config.js');

module.exports ={
	setUid(uid){
		uid +='';
		var type = '';
		if(!uid[0] > -1){
			type = uid[0];
			uid = uid.slice(1);
		}
		var pUid = '';
		for(var i = 0; i< uid.length; i++){
			pUid += config.uIdKey.indexOf(uid[i]);
		}
		return type + pUid
	},
	getUid(pUid){
		pUid +='';
		var uid = '';
		var type = '';
		if(!pUid[0] > -1){
			type = pUid[0];
			pUid = pUid.slice(1);
		}
		for(var i = 0; i< pUid.length; i++){
			uid += config.uIdKey[pUid[i]];
		}
		return type + uid
	}
}
