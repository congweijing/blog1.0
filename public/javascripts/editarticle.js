window.onload=function(){
    //给该页面的导航添加active类
    document.getElementById("newArticle").getElementsByTagName("a")[0].setAttribute("class","active");
    //异步加载文章分类数据、然后回调按钮的特效
    refreshCate(); 
    localOrlink();
    //表单验证
    var btnPublish = document.getElementById("btnPublish");
    var btnUpdate = document.getElementById("btnUpdate");
    var btnSave = document.getElementById("btnSave");
    var IsDraft = document.getElementById("IsDraft");
    btnPublish.onclick=function(){
        IsDraft.value = false;
        checkForm();
    }
    btnSave.onclick=function(){
        IsDraft.value = true;
        checkForm();
    }
    btnUpdate.onclick=function(){
        IsDraft.value = false;
        checkForm();
    }


    
    //保存草稿
    /*function submitSure(){
        var gn1=confirm("确认要发布？");
        if(gn1==true){
            //return true;
            document.getElementById("postForm").submit();
        }else{
            return false;
        }
    }
    document.getElementById("btnPublish").onclick = function(){
        document.getElementById("IsDraft").value = false;
        submitSure();
    }*/
}

//异步获取分类数据
function refreshCate(){
    var categorylist=document.getElementById("Categorylist").getElementsByTagName("ul")[0]
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
                for(var i=0;i<data.length;i++){
                    var oldstring = categorylist.innerHTML;
                    //$("#Categorylist ul").append("<li data-value=\""+data[i]._id+"\"><a href=\"#\">"+data[i].CateName+"</a></li>");
                    categorylist.innerHTML=oldstring+"<li data-value=\""+data[i]._id+"\"><a href=\"#\">"+data[i].CateName+"</a></li>";
                }
                              
                //渲染分类按钮
			    var categoryIdvalue=document.getElementById("CategoryId").value;
			    var selectlistarray=document.getElementById("Categorylist").getElementsByTagName("li");
			    for(var i=0;i<selectlistarray.length;i++){
			    	if(categoryIdvalue==selectlistarray[i].getAttribute("data-value"))
			    	{
			    		document.getElementById("Categorylist").getElementsByTagName("button")[0].getElementsByTagName("span")[0].innerHTML=selectlistarray[i].innerHTML;
			    	}	
			    }
			    var selectList0 = new Selectlist('selectlist');
                selectList0.init();
            }
        }
    }
    xmlhttp.open("post","/admin/getCategories",true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send(null);

}
//选择分类按钮，创建声明函数对象
function Selectlist(selectlist){
    this.selectList=document.getElementsByClassName(selectlist)[0];//选中btngroup
    this.selectIpt = document.getElementsByClassName(selectlist)[0].getElementsByTagName("input")[0];//选中input
    this.selectLi=document.getElementsByClassName(selectlist)[0].getElementsByTagName("li");//选中下拉菜单的每一个元素
    this.selectBtn=document.getElementsByClassName(selectlist)[0].getElementsByTagName("button")[0].getElementsByTagName("span")[0];//选中显示区
}
Selectlist.prototype={
    selectList : '',
    selectIpt : '',
    selectLi : '',
    selectBtn : '',
    selectPick : function(){//原型链中的this指向对象
        var li = this.selectLi,
        //var select = this.selectList,
        self = this;//内部函数（比如本函数里面包含的两个匿名函数）
                    //在搜索this变量时，只会搜索到属于它自己的this，而不会搜索到包含它的那个函数的this。
                         //所以，为了在内部函数能使用外部函数的this对象，要给它赋值了一个名叫self的变量。
        function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}
        for(var i = 0;i<li.length;i++){
            li[i].onclick=function(){  //循环绑定函数，注意作用域问题
                self.selectBtn.innerHTML=trimStr(this.innerHTML);
                self.selectIpt.value=this.getAttribute("data-value");  //如何获取自定义属性
                self.selectList.getElementsByClassName("active")[0].classList.remove("active");
                this.classList.add("active");
            }

        }
        return this;
    },
    init : function(){
        this.selectPick();
    }
}

//本地还是外链
function localOrlink(){
    document.getElementById("block-link").classList.add("hidden");
    document.getElementById("Source").getElementsByTagName("label")[1].onclick=function(){
        document.getElementById("block-local").classList.remove("hidden");
        document.getElementById("block-link").classList.add("hidden");
    }
    document.getElementById("Source").getElementsByTagName("label")[2].onclick=function(){
        document.getElementById("block-local").classList.add("hidden");
        document.getElementById("block-link").classList.remove("hidden");
    }
}

///////表单验证
function checkForm(){
        var title = document.getElementById("Title");
        var alias = document.getElementById("Alias");
        var summary = document.getElementById("Summary");
        var link = document.getElementById("link");
        var Url = document.getElementById("Url");
        //url的正则表达式
        var match = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
        if(!title.value){
            title.focus();
            return;
        }else if(!alias.value){
            alias.focus();
            return;
        }else if(!summary.value){
            summary.focus();
            return;
        }else if(link.checked==true){
            if(!Url.value||match.test(Url.value)==false){
            Url.focus(Url);
            return;
            }            
        }
        var postForm = document.getElementById("postForm")
        postForm.submit();
}

