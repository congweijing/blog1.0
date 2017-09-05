var db = require('./db');
var mongoose = db.mongoose;//连接数据库


var postSchema = new mongoose.Schema({
	//唯一键
	_id:{type:String,unique:true},
	//创建时间
	CreateTime:{type:Date},
	//修改时间
	ModifyTime:{type:Date},
    //标题
	Title:{type:String},
	//文章别名
	Alias:{type:String},
	//摘要
	Summary:{type:String},
	//来源
	Source:{type:String},
	//内容
	Content:{type:String},
	//分类Id
	CategoryId:{type:String},
	//标签
	Labels:{type:String},
	//外链URL
	Url:{type:String},
	//浏览次数
	ViewCount: {type: Number},
	//是否草稿
	IsDraft:{type:Boolean}
});
//model用来CURD
var postModel = mongoose.model('post',postSchema)
module.exports = postModel;
//var postModel = mongoose.model('post', postSchema, 'post');
