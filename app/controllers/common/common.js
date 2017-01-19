var abc=['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
'o','p','q','r','s','t','u','v','w','x','x','z','_','?','*','-'];

module.exports = {
	getToken(){
		var result='';
		while(result.length < 10){
			if(Math.random() < 0.5){
				result += parseInt(Math.random()*10);
			}else{
				result += abc[parseInt(Math.random()*30)]
			}
		}
		return result
	}
}
