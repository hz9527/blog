var mongoose = require('./mongoose.js');
var models = mongoose();
models = models.models;
for(var key in models){
	models[key].remove(function(err, product){
		if(err){return}
		console.log(key)
	})
}
