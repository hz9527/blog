var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
	_id: String,//c+bid
	limit: Number,//0 self 1 fans 2 follow 3 fans&follow 4 all
	fans: {type: mongoose.Schema.Types.ObjectId, ref:'Fans'},
	key: String,
	comments: [
		{//存数据时如果是匿名，增加bName，bId，uId字段，否则只需要存uId字段
			backType: Number,//1 blog 2 comment
			back: String,//回复对象
			bName: String,//返回给客户端用户名
			bId: String,//返回给客户端id
			uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
			content: String,
			createTime: {type: Number, default: Date.now()}
		}
	]
});
var Comments = mongoose.model('Comments', CommentsSchema);
