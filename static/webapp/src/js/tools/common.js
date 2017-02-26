//http实例，将管理所有的http
//在各个组件中使用为this.http(method, url, data).then(scb,ecb)
module.exports = {
	HTTP: function (loading, cb){
		return function(method, url, data, key){
			var that = this;
			var xhr = new XMLHttpRequest();
			data&&(data=JSON.stringify(data));

			xhr.then = function(scb, ecb){
				xhr.next = scb || function(){};
				xhr.err = ecb || xhr.next;
			};

			xhr.open(method, url);
			// (method == 'post' || method == 'put') && xhr.setRequestHeader('Content-Type','application/json');
			// console.log(data)
			xhr.send(data || null);
			loading && loading(this, key || 'loading');

			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4){
					cb && cb(that, key || 'loading');
					if(xhr.status === 200 || xhr.status>=300 && xhr.status<=304){
						xhr.next.call(that, JSON.parse(xhr.responseText));
					}else{
						xhr.err.call(that, xhr);
					}
				}
			}
			return xhr;
		}
	},
	THROTTLE(cb,key,t){//后续为cb参数,定时器对象传入key，否则形成闭包不能起到节流作用
		var that = this;
		var arg = Array.prototype.splice.call(arguments, 3);
		console.log(t)
		clearTimeout(window.timer[key]);
		window.timer[key] = setTimeout(function(){
			cb.apply(that,arg);
		}, t ? t:50);
	}
}
