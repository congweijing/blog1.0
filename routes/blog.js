var express = require('express');
var router = express.Router();
var post = require('../proxy/post');
var category = require('../proxy/category');
var async = require('async');
var moment = require('moment');
var url = require('url');

//根据分类获取数据
router.get('/:category?',function(req,res,next){
    var currentCate = req.params.category || '';
    var flag;
    category.getAll(true,function(err,categories){
        if(err){
            next(err);
        }else{
            for(var i=0;i<categories.length;i++){
                if(currentCate==categories[i].Alias){   
                    flag=true;
                    break;
                }
                flag=false;
            }
            if(flag){   
                res.render('blog/index',{
                    title:"一只猫",
                    cateData:categories,
                    currentCate:currentCate
                }) 
            }else{
                res.render('blog/index',{
                title:"一只猫",
                cateData:categories
                })
            }
        }
    })
})

//获取文章列表
router.post('/getPosts',function(req,res,next){
    async.parallel([
        //并行任务1 获取文章
        function(cb){
            async.waterfall([
                function(cb){
                    category.getByAlias(req.body.CateAlias,function(err,category){
                        if(err){
                            cb(err);
                        }else{
                            cb(null,category);
                        }
                    })
                },
                //第一个任务获取的结果传给第二个任务
                function(category,cb){
                    var params = {
                        categoryId:category._id,
                        sortBy:req.body.SortBy,
                        keyWord:req.body.Keyword,
                        filterType:req.body.FilterType,
                    }
                    post.getPosts(params,function(err,posts){
                        if(err){
                            cb(err);
                        }else{
                            cb(null,posts);
                        }
                    })
                }
            ], 
            function (err, result) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, result);
                }
            })
        },
        //并行任务2 获取所有分类
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
            var posts = results[0];
            var categories = results[1];
            var result = [];
            if(err){
                next(err);
            }else{
                posts.forEach(function(item){
                    var post = {
                        Source: item.Source,
                        Alias: item.Alias,
                        Title: item.Title,
                        Url: item.Url,
                        PublishDate: moment(item.CreateTime).format('YYYY-MM-DD'),
                        Host: item.Url ? url.parse(item.Url).host : '',
                        Summary: item.Summary,
                        UniqueId: item.UniqueId,
                        ViewCount: item.ViewCount
                    };
                    categories.forEach(function(cateitem){ //对所有旧的数据进行处理
                        if(item.CategoryId==cateitem._id){    //如果文章中有id那么对其进行更新
                            post.CategoryAlias = cateitem.Alias;
                            post.CateName = cateitem.CateName;
                        }
                    });
                    result.push(post);
                });
                res.send({posts: result});
            }
        })
});

//文章详情页
router.get('/:category/:article',function(req,res,next){
    var alias = req.params.article,
        cateAlias = req.params.category;
    async.parallel([
        function(cb){
            post.getPostByAlias(alias,function(err,post){
                if(err){
                    cb(err);
                }else{
                    cb(null,post);
                }
            })
        },
        function(cb){
            category.getAll(true,function(err,categories){
                if(err){
                    cb(err);
                }else{
                    cb(null,categories);
                }
            })
        }
    ],function(err,results){
        if(err){
            next(err)
        }else{
            var article = results[0];
            var categories = results[1];
            var trueCateAlias;
            var cateName;
            var LabelList;
            for(var i=0;i<categories.length;i++){
                if(article.CategoryId==categories[i]._id){
                    trueCateAlias=categories[i].Alias;
                    cateName=categories[i].CateName;
                    break;
                }
            }
            // cateAlias是博客首页提取博客数据时的分类；
            // trueCateAlias是打开博客详情页时的分类，
            // 防止后台修改分类alias数据没有及时更新，
            // 另外文章是按照文章alias获取的所以即使分类alias被修改也不影响文章的获取，
            // 那如果文章alias被修改是不是就查不到了，是的
            // find函数没有返回值会返回什么是err吗？那如果有err前端会提示err页面的。
            if (cateAlias !== trueCateAlias) {  
               res.redirect(util.format('/blog/%s/%s', trueCateAlias, alias));
            }
            LabelList = article.Labels.split(/[,，]/);
            var post = {
                UniqueId: article._id,
                Title: article.Title,
                CategoryAlias: cateAlias,
                CateName: cateName,
                CreateTimeStr: moment(article.CreateTime).format('YYYY-MM-DD hh:mm'),
                ViewCount: article.ViewCount,
                LabelList: LabelList,
                Summary: article.Summary,
                Content: article.Content
            };
            res.render('blog/article', {
                post: post
            });
        }
    })
    
    
})
module.exports = router;