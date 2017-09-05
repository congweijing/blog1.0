var mongoose = require("mongoose");

var DbPath = "mongodb://localhost/myblog";
mongoose.connect(DbPath,function(err){
	if(!err){
		console.log("connected to the myblog")
	}else{
		throw err;
	}
});
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DbPath);  
});
exports.mongoose = mongoose;

