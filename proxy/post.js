var postModel = require('../models/post');
//新增或更新文章
exports.save = function(params,callback){
	var _id = params.UniqueId,
		entity = new postModel({
			Title:params.Title,
			Alias:params.Alias,
			Summary:params.Summary,
			Source:params.Source,
			Content:params.Content,
			CategoryId:params.CategoryId,
			Labels:params.Labels,
			Url:params.Url,
			IsDraft:params.IsDraft,
			ModifyTime:new Date()
		});
	postModel.findById(_id,function(err,article){
		if(err){
			return callback(err);
		}
		if(!article){
			//新增
			entity._id = _id;
			entity.ViewCount = 0;
			entity.CreateTime = new Date();
			entity.save(function(err){
				if(err){
					return callback(err);
				}
				return callback(null);
			});
		}else{
			//更新,第一个参数为查询条件，第二个参数为更新的实体，（第三个参数是若没有查询到是否插入，默认不插入/第四个参数默认为false只找到一条为true找到所有）
			postModel.update({"_id":_id},entity,function(err){
				if(err){
					return callback(err);
				}
				return callback(null);
			})
		}
	})
}

//获取文章
exports.getArticles = function(params,callback){
	var page = parseInt(params.pageIndex)||1;
	var size = parseInt(params.pageSize)||10;
	page = page > 0 ? page : 1;
	var options={};
	options.skip = (page-1)*size;
	options.limit=size;
	options.sort = params.sortOrder === 'desc' ? '-CreateTime' : 'CreateTime';
	var query = {};
	if(params.categoryId){
		query.CategoryId = params.categoryId;
	}if(params.title){
		query.Title = {"$regex":params.title,"$options":"$gi"} //正则表达式，全局搜索且不区分大小写
	}
	postModel.find(query,{},options,function(err,posts){
		if(err){
			return callback(err)
		}else{
			return callback(null,posts);
		}
	})
}
//获取文章总数
exports.getArticlesCount = function(params,callback){
	var query = {};
	if(params.categoryId){
		query.CategoryId = params.categoryId;
	}if(params.title){
		query.Title = {"$regex":params.title,"$options":"$gi"} //正则表达式，全局搜索且不区分大小写
	}
	postModel.count(query,function(err,count){
		if(err){
			return callback(err);
		}
		return callback(null,count);
	})
}

//根据id获取文章
exports.getById = function(id,callback){
	postModel.findById(id,function(err,post){
		if(err){
			return callback(err);
		}
		return callback(null,post);
	});
}
//根据id删除文章,此处的id指对象 {_id :id}
exports.deleteById = function(id,callback){
	postModel.remove(id,function(err){
		if(err){
			return callback(err);
		}
		return callback(null);
	})
}
//根据分类获取文章
function getPostsQuery(params) {     //获取查询条件
	var query = {};
	query.IsDraft = false;
	if(params.categoryId){
		query.CategoryId = params.categoryId;
	}
	if(params.keyWord){
		switch(params.filterType){ //默认则是在标题，标签，摘要，正文中查找
			case '1':
				query.Title = {"$regex":params.keyWord,"$options":"$gi"};
				break;
			case '2':
				query.Lables = {"$regex":params.keyWord,"$options":"$gi"} 
				break;
			case '3':
				query.CreateTime = {"$regex":params.keyWord,"$options":"$gi"} 
				break;
			default:
                query.$or = [{
                    "Title": {
                        "$regex": params.keyWord,
                        "$options": "gi"
                    }
                }, {
                    'Labels': {
                        "$regex": params.keyWord,
                        "$options": "gi"
                    }
                }, {
                    'Summary': {
                        "$regex": params.keyWord,
                        "$options": "gi"
                    }
                }, {
                    'Content': {
                        "$regex": params.keyWord,
                        "$options": "gi"
                    }
                }];
        }
	}
	return query;
}
exports.getPosts= function(params,callback){
	//var page = parseInt(params.pageIndex)||1;
	//var size = parseInt(params.pageSize)||10;
	//page = page > 0 ? page : 1;
	var options={};
	//options.skip = (page-1)*size;
	//options.limit=size;
	//options.sort = params.sortOrder === 'desc' ? '-CreateTime' : 'CreateTime';
	options.sort = params.sortBy === 'title' ? 'Title -CreateTime' : '-CreateTime';
	var query = getPostsQuery(params);
	postModel.find(query,{},options,function(err,posts){
		if(err){
			return callback(err);
		}else{
			return callback(null,posts);
		}
	})
}
//根据文章alias获取文章
exports.getPostByAlias = function(alias,callback){
	postModel.update({"Alias":alias},{"$inc":{"ViewCount":1}}).exec();//ViewCount+1
	postModel.findOne({"Alias":alias},function(err,post){
		if(err){
			return callback(err);
		}else{
			return callback(null,post);
		}
	})
}