var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session'); 
var bodyParser = require('body-parser');

var route = require('./routes/index');
var blog = require('./routes/blog');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var ue = require('./routes/ue');
var about = require('./routes/about');
var passport = require('passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser()); //该定义必须写在路由分配之前：
app.use(session({
    secret: 'myblog-exp-session',  //secret：用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 //sessionID对应的cookie设置maxAge是1天，cookie过期时间，毫秒。
    },
    resave: false, //是指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒。
    saveUninitialized: false  //无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', route);
app.use('/', auth);
app.use('/', about);
app.use('/blog',blog);
app.use('/admin', require('connect-ensure-login').ensureLoggedIn('/login'), admin);
app.use('/ueditor/ue',ue);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  var code = err.status||500;
  var message = code===404?"你请求的页面找不到了":"服务器出错了";
  // render the error page
  res.status(code);
  res.render('./shared/error',{
    code:code,
    message:message
  });
});

module.exports = app;
