var express = require('express');
var router = express.Router();
var category = require('../proxy/category');

/* GET home page. */
router.get('/', function(req, res, next) {
	category.getAll(true,function(err,categories){
		if(err){
			next(err);
		}else{
			res.render('blog/index',{
				title:"一个叫丛丛的人",
				cateData:categories,
				currentCate:""
			})
		}
	})
});

module.exports = router;

