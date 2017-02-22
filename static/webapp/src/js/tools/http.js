//http实例，将管理所有的http
//在各个组件中使用为this.http(method, url, data).then(scb,ecb)
module.exports = function HTTP(loading, cb){
	return function(method, url, data){
		var that = this;
		var xhr = new XMLHttpRequest();
		data&&(data=JSON.stringify(data));

		xhr.then = function(scb, ecb){
			xhr.next = scb || function(){};
			xhr.err = ecb || xhr.next;
		};

		xhr.open(method, url);
		// xhr.setRequestHeader('Content-Type','application/json');
		console.log(data)
		xhr.send(data || null);
		loading && loading(this);

		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				cb && cb(this);
				if(xhr.status === 200 || xhr.status>=300 && xhr.status<=304){
					xhr.next.call(that, JSON.parse(xhr.responseText));
				}else{
					xhr.err.call(that, xhr);
				}
			}
		}
		return xhr;
	}
}
