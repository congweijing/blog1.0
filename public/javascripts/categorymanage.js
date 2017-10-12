window.onload=function(){
    //给该页面的导航添加active类
    document.getElementById("categoryManage").getElementsByTagName("a")[0].setAttribute("class","active");
    //异步加载文章分类数据、添加事件
    refreshCate();    
	//事件委托
	var categoryList = document.getElementById("categoryList");
	categoryList.onclick = function (ev) {
		var ev = ev || window.event;
		var target = ev.target || ev.srcElement;
		if(target.nodeName.toLocaleLowerCase() == 'i'){
			var deleteNode = target.parentNode.parentNode.parentNode;
			var parentNode = deleteNode.parentNode;
			parentNode.removeChild(deleteNode);
		}
	}
	categoryList.onchange = function (ev) {
		var ev = ev || window.event;
		var target = ev.target || ev.srcElement;
		if(target.nodeName.toLocaleLowerCase() == 'input'){
			var toChangeNode = target.parentNode.parentNode.parentNode;
			if(target.className.indexOf("txtName")>=0){
				toChangeNode.setAttribute("data-catename",target.value);
			}else if(target.className.indexOf("txtAlias")>=0){
				toChangeNode.setAttribute("data-alias",target.value);
			}
		}
	}
    //保存按钮，首先判断列表中的数据有没有重复，然后提交表单
    document.getElementById("btnSave").onclick=function(){
    	if(isValidData()){
    		var categoryList=document.getElementById("categoryList").getElementsByTagName("li");
    		var data = "";
    		for(var i=0;i<categoryList.length;i++){
    			data +="{\"category\":\""+categoryList[i].getAttribute("data-catename")+"\",\"alias\":\""+categoryList[i].getAttribute("data-alias")+"\",\"uniqueid\":\""+categoryList[i].getAttribute("data-uniqueid")+"\"},";
    		}
    		var data = "["+data.substring(0,data.length-1)+"]";
    		ajax({
			    method: 'POST',
			    url: '/admin/saveCategories',
			    data:{"json":data},
			    success: function (response) {
			       alert("保存成功");
			    }
			});

    	}
    }

    //新建按钮并且绑定事件
    document.getElementById('btnNew').onclick=function(){
		var cateitem =  "<div class=\"row\">"
            + "<div class=\"col-md-2\">"
            + "<input class=\"form-control txtName\" type=\"text\" value=\"" + "" + "\" placeholder=\"分类名称\"/>"
            + "</div>"
            + "<div class=\"col-md-2\">"
            + "<input class=\"form-control txtAlias\" type=\"text\" value=\"" + "" + "\" placeholder=\"分类alias\"/>"
            + "</div>"
            + "<button class=\"btn btn-link btn-del-cate\" title=\"移除分类\"><i class=\"fa fa-times\"></i></button>"
            + "</div>";
        var categoryList = document.getElementById("categoryList");
        var li = document.createElement("li");
        li.setAttribute("class","list-group-item");
        li.setAttribute("data-uniqueid","");
		li.setAttribute("data-catename","");
		li.setAttribute("data-alias","");
        categoryList.appendChild(li);
        li.innerHTML=cateitem;

        //绑定点击事件
    	/*li.getElementsByTagName("button")[0].onclick=function(){
    		var deleteNode = this.parentNode.parentNode
    		var parentNode = deleteNode.parentNode;
    		parentNode.removeChild(deleteNode);
    	}*/
    	//绑定change事件
    	/*li.getElementsByClassName("txtName")[0].onchange=function(){
    		li.setAttribute("data-catename",this.value);
    	}
    	li.getElementsByClassName("txtAlias")[0].onchange=function(){
    		li.setAttribute("data-alias",this.value);
    	}*/
    }


}
//异步获取分类数据
function refreshCate(){
	ajax({
		method:"POST",
		url:"/admin/getCategories",
		aysnc:"true",
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success:function (response) {
			var data = JSON.parse(response);
			var cate ="";
			for(var i=0;i<data.length;i++){
				var cateitem = "<li class=\"list-group-item\" data-uniqueid=\"" + data[i]._id + "\" data-catename=\"" + data[i].CateName + "\" data-alias=\"" + data[i].Alias + "\">"
				+ "<div class=\"row\">"
				+ "<div class=\"col-md-2\">"
				+ "<input class=\"form-control txtName\" type=\"text\" value=\"" + data[i].CateName + "\" placeholder=\"分类名称\"/>"
				+ "</div>"
				+ "<div class=\"col-md-2\">"
				+ "<input class=\"form-control txtAlias\" type=\"text\" value=\"" + data[i].Alias + "\" placeholder=\"分类alias\"/>"
				+ "</div>"
				+ "<button class=\"btn btn-link btn-del-cate\" title=\"移除分类\"><i class=\"fa fa-times\"></i></button>"
				+ "</div>"
				+ "</li>";
				cate =cate+cateitem;
			}
			document.getElementById("categoryList").innerHTML=cate;
			//addEventDelete();
			//addEventChange();
		}
	})
}
//判断分类名称和别名是否唯一
function isValidData() {
    var result = true;
    var items = document.getElementById("categoryList").getElementsByTagName("li");
    var cateNames = [];
    var cateAliases = [];
    for (var i = 0; i < items.length; i++) {
        var cateName = items[i].getAttribute("data-catename");
        var cateAlias = items[i].getAttribute("data-alias");
        if (cateName === "" || cateAlias === "") {
        	alert("分类名称、分类alias都不能为空！");
            result = false;
            break;
        }
        if(cateNames.indexOf(cateName)==-1){
        	cateNames.push(cateName);
        }else{
        	alert("分类名称\""+cateName+"\"不唯一");
			result = false;
        }
        if(cateAliases.indexOf(cateAlias)==-1){
        	cateAliases.push(cateAlias);
        }else{
        	alert("分类alias\""+cateAlias+"\"不唯一")
			result = false;
        }
    }
    return result;
}
//封装ajax请求
function ajax(opt) {
    opt = opt || {};
    var method = opt.method.toUpperCase() || 'POST';
    var url = opt.url || '';
    var async = opt.async || true;
    var data = opt.data || null;
	var contentType = opt.contentType || 'application/json;charset=utf-8';
    var success = opt.success || function () {};
    var xmlHttp = null;
	//针对firefox Mozillor Opera Safari,IE7,IE8,创建XHR对象
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
	//IE5,IE6
    else if(window.ActiveXObject){
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
		
    if (method === 'POST') {
        xmlHttp.open(method, url, async);
        xmlHttp.setRequestHeader('Content-Type', contentType);
        xmlHttp.send(JSON.stringify(data));
    }
    else if (method === 'GET') {
        xmlHttp.open(method, url, async);
        xmlHttp.send(null);
    } 
	
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            success(xmlHttp.responseText);
        }
    };
}

//移除标签,循环绑定事件，动态创建标签之后再次绑定事件
/*function addEventDelete(){
    var btnDeleteList = document.getElementsByClassName("btn-del-cate");
    for(var i=0;i<btnDeleteList.length;i++){
    	btnDeleteList[i].onclick=function(){
    		var deleteNode = this.parentNode.parentNode
    		var parentNode = deleteNode.parentNode;
    		parentNode.removeChild(deleteNode);
    	}
    }
}*/
//添加change事件
/*function addEventChange(){
    var NameChangeList = document.getElementsByClassName("txtName");
    var AliasChangeList = document.getElementsByClassName("txtAlias");
    for(var i=0;i<NameChangeList.length;i++){
    	NameChangeList[i].onchange=function(){
    		var toChangeNode = this.parentNode.parentNode.parentNode;
    		toChangeNode.setAttribute("data-catename",this.value);
    	}
    }
    for(var i=0;i<AliasChangeList.length;i++){
    	AliasChangeList[i].onchange=function(){
    		var toChangeNode = this.parentNode.parentNode.parentNode;
    		toChangeNode.setAttribute("data-alias",this.value);
    	}
    }
}*/


