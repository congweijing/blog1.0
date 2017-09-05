var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var post = require('../proxy/post');
var category = require('../proxy/category');
var moment = require('moment');
var async = require('async');

//后台首页，新的文章录入页
router.get('/',function(req,res,next){
	res.render('admin/index',{
		uniqueId:shortid.generate()
	});
})
//分类管理录入页
router.get('/categorymanage',function(req,res,next){
	res.render('admin/categorymanage');
});
//保存分类列表
router.post('/saveCategories',function(req,res,next){
	console.log(req.body);
	var array = JSON.parse(req.body.json);
	category.save(array,function(err){
		if(err){
			next(err);
		}else{
			res.end();
		}
	});
})

//修改文章、编辑文章
router.get('/editArticle/:id',function(req,res,next){
	var id = req.params.id;
	if (!id) {
        res.redirect('/admin/articlemanage');
    }
	post.getById(id,function(err,post){
		if(err){
			next(err);
		}else{
			res.render('admin/editarticle',{
				post:post
			});
		}
	});
	
})
//文章管理
router.get("/articlemanage",function(req,res,next){
	res.render("admin/articlemanage");
})

//删除文章
router.post("/deleteArticle",function(req,res,next){
	var delcondition = {
		_id:req.body.id
	}
	post.deleteById(delcondition,function(err){
		if(err){
			next(err);
		}
		res.end();
	})
})
//异步获取文章分类的路由
router.post('/getCategories',function(req,res,next){
	category.getAll(function(err,data){
		if(err){
			callback(err);
		}else{
			res.json(data);
		}
	})
})

//异步获取文章分类的路由
router.post('/getCateFilter',function(req,res,next){
	category.getAll(true,function(err,data){
		if(err){
			callback(err);
		}else{
			res.json(data);
			console.log(data);
		}
	})
})
//删除文章
router.post('/deleteArticle',function(req,res,next){
	res.send("delete");
})
//获取文章
router.post("/getArticles",function(req,res,next){
	console.log(req.body);
	var filter,
		params={
		pageIndex:req.body.pageNumber,
		pageSize:req.body.pageSize,
		sortName:req.body.sortName,
		searchText:req.body.searchText
	};
	if(req.body.filter){
		filter = JSON.parse(req.body.filter);
        params.categoryId = filter.CateName;
        params.title = filter.Title;
	}
	//有一个出错就退出，并行且无关联，提高性能
	//第一个参数是由函数组成的数组,第二个参数是回调函数
	async.parallel([
		//获取文章数据
		function(cb){
			post.getArticles(params,function(err,posts){
				if(err){
					cb(err);
				}else{
					cb(null,posts);
				}
			});
		},
		//获取文章总数
		function(cb){
			post.getArticlesCount(params,function(err,count){
				if(err){
					cb(err);
				}else{
					cb(null,count);
				}
			})
		},
		//获取文章分类
		function(cb){
			category.getAll(true,function(err,categories){
				if(err){
					cb(err);
				}else{
					cb(null,categories);
				}
			})
		}],
		function(err,results){
			var posts = results[0],
				count = results[1],
				categories = results[2],
				result = [];
			console.log(posts);
			posts.forEach(function(item){
				var post = {
					UniqueId:item._id,
					Alias:item.Alias,
					Title:item.Title,
					CreateTime:moment(item.CreateTime).format('YYYY-MM-DD HH-mm-ss'),
					ModifyTime:moment(item.ModifyTime).format('YYYY-MM-DD HH-mm-ss'),
					Summary:item.Summary,
					ViewCount:item.ViewCount,
					Source:item.Source,
					Url:item.Url,
					IsDraft:item.IsDraft
				};
				categories.forEach(function(cateitem){ //对所有旧的数据进行处理
					if(item.CategoryId==cateitem._id){    //如果文章中有id那么对其进行更新
						post.CategoryAlias = cateitem.Alias;
                    	post.CateName = cateitem.CateName;
                    	console.log(post.CateName);
					}
				});
				result.push(post);
			})
			if(err){
				next(err);
			}else{
				res.send({
					rows:result,
					total:count
				})
			}
		});

})
//保存文章
router.post('/saveArticle',function(req,res,next){
	var params ={
		UniqueId: req.body.UniqueId,//唯一键必须有
        Title: req.body.Title,
        Alias: req.body.Alias,
        Summary: req.body.Summary,
        Source: req.body.Source,
        Content: req.body.Content,
        CategoryId: req.body.CategoryId,
        Labels: req.body.Labels,
        Url: req.body.Url,
        IsDraft: req.body.IsDraft
	};
	console.log(req.body);
	post.save(params,function(err){
		if(err){
			next(err);
		}else{
			res.send(req.body);
		}
	})
});


module.exports = router;