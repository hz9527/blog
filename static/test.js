//mini jq
function $(select){
	return document.querySelector(select);
}
// 注册接口
$('#signUp').onclick=function(){
	$http('post','/sign',{userName:'hz3', passWord:'123456'}).then(
		function(res){
			console.log(res)
		}
	)
}
// 检查账户是否已注册接口
$('#checkSign').onclick=function(){
	$http('get', '/sign?userName=hz1').then(
		function(res){
			console.log(res);
		}
	)
}

// 登录账户

$('#stopUsing').onclick=function(){
	$http('get', '/api/sign').then(
		function(res){
			console.log(res)
		}
	)
}

function $http(method,url,params){
	var xhr=getXhr();
	params&&(params=JSON.stringify(params));
	xhr.then=function(cb){
		this.next=cb;
	}
	xhr.open(method,url);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.send(params || null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4&&(xhr.status==200||xhr.status>=300&&xhr.status<=304)){
			xhr.next(xhr);
		}
	}
	return xhr;
}
function getXhr(){
	var xhr=null;
	if(XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHttp');
	}
	return xhr;
}
