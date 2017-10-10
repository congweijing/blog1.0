var categoryModel = require("../models/category");
var postModel = require("../models/post");
var shortid = require("shortid");

//未分类 不能随便乱修改，因为后台录入的时候写在前端的和这个是对应的
var cateOther = {
    "_id": "other",
    "Alias": "other",
    "CateName": "未分类"
};
//全部分类
var cateAll = {
    "_id": "",
    "Alias": "",
    "CateName": "全部分类"
};
//保存分类数据
exports.save = function(array,callback){
	var jsonArray = [];//存放前端提交过来的json数组
	var toUpdate = [];//存放即将删除的旧分类中的id
	var updateQuery = [];//存放查询条件，用于更新文中已经被删除的分类
	if(array.length>0){
		array.forEach(function(item){
			jsonArray.push({
				_id:item.uniqueid||shortid.generate(),
				CateName:item.category,
				Alias:item.alias,
				CreateTime:new Date(),
				ModifyTime:new Date()
			});
		});
	}
	//对所有旧的数据进行处理
	categoryModel.find(function(err,categories){
		if(err){
			return callback(err);
		}else{
			categories.forEach(function(olditem){ //对所有旧的数据进行处理
				for(var i =0;i<jsonArray.length;i++){
					var json = jsonArray[i]
					if(json._id==olditem._id){    //新提交的数据中有原来的id说明旧的id是是有用的
						json.CreateTime = olditem.CreateTime;
						if (json.CateName.toString() === old.CateName.toString() && cateNew.Alias.toString() === old.Alias.toString()) {
							json.ModifyTime = old.ModifyTime;
                		}
					}else{
						toUpdate.push(olditem._id);//即将删除的旧数据
					}
				}
			});
		}
	});

	//将已经删除的分类的文章设置为未分类
	if(toUpdate.length>0){
		toUpdate.forEach(function(cateId){
			updateQuery.push({"CategoryId":cateId});
		});
		//更新文章的分类  $or逻辑条件操作符“或” 可以和$in相互转换 
		postModel.update({"$or": updateQuery}, {"CategoryId": "other"}, {multi: true}, function (err) {
            if (err) {
                return callback(err);
            }
        });
	}

	//将旧的分类全部删除，插入全部新的分类
	categoryModel.remove(function(err){
		if(err){
			callback(err);
		}
		if(jsonArray.length>0){
			//插入全部分类
            //categoryModel.create(jsonArray, function (err) {}); //不用这个，因为这个内部实现依然是循环插入，不是真正的批量插入
            //这里采用mongodb原生的insert来批量插入多个文档
            categoryModel.collection.insert(jsonArray,function(err){
            	if(err){
            		callback(err);
            	}
            	return callback(null);
            })
		}else{
			return callback(null);
		}
		
	})
}
//获取分类数据
exports.getAll = function(isAll,callback){
	if (typeof isAll === 'function') {
        callback = isAll;
        isAll = false;
    }
	categoryModel.find(function(err,categories){
		if(err){
			return callback(err);
		}
		if (isAll) {
            categories.push(cateOther);
        }
		return callback(null,categories);
		
	})
}

//根据分类alias获取分类对象
exports.getByAlias = function(alias,callback){
	if(alias){
		if(alias=="other"){
			return callback(null,cateOther);
		}else{
			categoryModel.findOne({"Alias":alias},function(err,category){
				if(err){
					return callback(err);
				}else{
					return callback(null,category);
				}
			});
		}
	}else{
		return callback(null,cateAll);
	}
}
