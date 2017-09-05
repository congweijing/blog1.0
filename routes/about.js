var express = require('express');
var router = express.Router();

router.get('/aboutme',function(req,res,next){
	res.render("about/aboutme");
})
router.get('/aboutblog',function(req,res,next){
	res.render("about/aboutblog");
})

module.exports = router;