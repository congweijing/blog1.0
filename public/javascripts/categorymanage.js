window.onload=function(){
    //给该页面的导航添加active类
    document.getElementById("categoryManage").getElementsByTagName("a")[0].setAttribute("class","active");
    //异步加载文章分类数据、添加事件
    refreshCate();    
    //保存按钮，首先判断列表中的数据有没有重复，然后提交表单
    document.getElementById("btnSave").onclick=function(){
    	if(isValidData()){
    		var categoryList=document.getElementById("categoryList").getElementsByTagName("li");
    		var data = "";
    		for(var i=0;i<categoryList.length;i++){
    			data +="{\"category\":\""+categoryList[i].getAttribute("data-catename")+"\",\"alias\":\""+categoryList[i].getAttribute("data-alias")+"\",\"uniqueid\":\""+categoryList[i].getAttribute("data-uniqueid")+"\"},";
    		}
    		var data = "["+data.substring(0,data.length-1)+"]";
            alert(data);
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
    	li.getElementsByTagName("button")[0].onclick=function(){
    		var deleteNode = this.parentNode.parentNode
    		var parentNode = deleteNode.parentNode;
    		parentNode.removeChild(deleteNode);
    	}
    	//绑定change事件
    	li.getElementsByClassName("txtName")[0].onchange=function(){
    		li.setAttribute("data-catename",this.value);
    	}
    	li.getElementsByClassName("txtAlias")[0].onchange=function(){
    		li.setAttribute("data-alias",this.value);
    	}
    }


}

//异步获取分类数据
function refreshCate(){
    if(window.XMLHttpRequest){
        //针对firefox Mozillor Opera Safari,IE7,IE8
        xmlhttp = new XMLHttpRequest();
        //针对某些特定版本的 Mozillor 的浏览器的bug进行修正
            if(xmlhttp.overrideMimeType){    
               xmlhttp.overrideMimeType("text/xml");
            }
    }else if(window.ActiveXObject){
        //针对IE6 IE5.5 IE5
        //两个可以用于创建XMLHttpRequest对象的控件名称，保存在一个js的数组中
        //排在前面的版本较新
        var activexName=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];
        for(var i=0;i<activexName.length;i++){
            try{
                //取出一个创建名进行创建，如果创建成功就终止循环
                //如果创建失败，会抛出异常，然后可以继续循环，继续尝试连接
                xmlhttp=new ActiveXObject(activexName[i]);
                break;
            }catch(e){
            }
        }
    }
    
    //确认XMLHttpRequest创建成功
    if(!xmlhttp){
        alert("XMLHttpRequest创建失败！");
        return;
    }else{
        //alert(xmlhttp.readyState);
    }
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState==4){
            if(xmlhttp.status==200){
                var data = JSON.parse(xmlhttp.responseText);
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
                addEventDelete();
                addEventChange();
            }
        }
    }
    xmlhttp.open("post","/admin/getCategories",true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send(null);

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
        	alert("分类名称\""+cateName+"\"不唯一")
        }
        if(cateAliases.indexOf(cateAlias)==-1){
        	cateAliases.push(cateAlias);
        }else{
        	alert("分类alias\""+cateAlias+"\"不唯一")
        }
    }
    return result;
}

//移除标签,循环绑定事件，动态创建标签之后再次绑定事件
function addEventDelete(){
    var btnDeleteList = document.getElementsByClassName("btn-del-cate");
    for(var i=0;i<btnDeleteList.length;i++){
    	btnDeleteList[i].onclick=function(){
    		var deleteNode = this.parentNode.parentNode
    		var parentNode = deleteNode.parentNode;
    		parentNode.removeChild(deleteNode);
    	}
    }
}
//添加change事件
function addEventChange(){
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
}

/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xmlHttp.send(JSON.stringify(opt.data));
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    } 
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}