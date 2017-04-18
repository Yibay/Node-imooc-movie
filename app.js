var express = require('express');
var app = express();

/* 1. 数据库 */
// 连接数据库
var dbUrl = 'mongodb://127.0.0.1:12345/imooc';
var mongoose = require('mongoose');
// Use native promises insteadof mpromise
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

/* 2. view层 模版 */
// 设置模版路径
app.set('views','./app/views/pages');
// 设置模版引擎
app.set('view engine','jade');

/* 3. http,cookie,session */
// 将表单数据格式化 为obj
var bodyParser = require('body-parser');
app.use(bodyParser());
//cookie格式化
var cookieParser = require('cookie-parser');
app.use(cookieParser());
//session
var session = require('express-session');
//session持久化——存储在mongodb数据库中
//因为session中间件不再绑定在express上，所以传入session，而非传入express
var mongoStore = require('connect-mongo')(session);
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'session'
	})
}))

/* 4. 静态文件 */
// 设置静态资源文件路径
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//设置全局参数
app.locals.moment = require('moment');

//开发环境 配置
var morgan = require('morgan');
if('development' === app.get('env')) {
	app.set('showStackError', true);
	//在后台log 如：GET /admin/userlist 200 
	app.use(morgan(':method :url :status'));
	//格式化 html、css、js 源码缩紧
	app.locals.pretty = true;
	//在后台log 如：Mongoose: users.find({}, { sort: { 'meta.updateAt': 1 }, fields: {} })
	mongoose.set('debug', true);
}

/* 5. mvc路由文件 */
require('./config/routes')(app);

/* 6. 启动服务器 */
// 监听端口号
var port = process.env.PORT || 3000;
app.listen(port);
//后台日志：确认已正常启动
console.log('imooc started on port ' + port);
