var express = require('express');
var router = express.Router();
var passport =require('passport');
var Strategy =require('passport-local').Strategy;
//定义验证策略，若成功回调account,验证回调需要返回验证结果
passport.use(new Strategy({
	usernameField:'UserName',
	passwordField:'PassWord'},
	function(username,password,cb){
		var account = require('../config/account');
		if(username === account.UserName && password === account.PassWord){
			return cb(null,account);//验证回调
		}else{
			return cb(null,false);
		}
	}
))
//验证用户提交的凭证是否正确，是与session中储存的对象进行对比，
//所以涉及到从session中存取数据，需要做session对象序列化与反序列化。
//将环境中的user.id序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中。
passport.serializeUser(function(user,cb){
	cb(null,user.id);
})
//从session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储与req.user中。
passport.deserializeUser(function(id,cb){
	var account = require('../config/account');
	if(id===account.id){
		cb(null,account);
	}else{
		cb(err);
	}
})
router.get('/login',function(req,res,next){
	res.render('auth/login');
})

router.post('/login',function(req,res,next){
	passport.authenticate('local',function(err,user,info){ //对req.username和req.password进行本地验证，也就是之前定义的new Strategy，验证通过返回该用户和附加信息
		if(err){
			next(err);
		}else if(!user){				//如果本地没有这个用户，发送valid:false给浏览器
			res.json({valid:false})
		}else{
			req.login(user,function(err){        //如果本地有这个用户，调用login方法，调用之前定义的passport.serializeUser方法
				var returnTo = '/admin';
				if (err) {
                    next(err);
                } else {
                    //尝试跳转之前的页面
                    if (req.session.returnTo) {
                        returnTo = req.session.returnTo;
                    }
                    res.json({
                        valid: true,
                        returnTo: returnTo
                    });
                }
			})
		}
	})(req,res,next);
})
module.exports = router;
//退出登录
router.post('/logout',
    function (req, res) {
        req.logout(); //作用是登出用户，删除该用户session。不带参数。
        res.redirect('/login');
    });

module.exports = router;
