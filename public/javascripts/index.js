$(function(){	
    $("#blog").addClass("active");
	requestData();

    //下拉按钮选中元素
    var selectList0 = new Selectlist('selectlist');
    selectList0.init();
    //搜索按钮
    $("#btnFilter").on("click", function () {
        searchPost();
    });
    //关键词回车
    $("#Keyword").on("keypress", function (e) {
        if (e.which == 13 || e.which == 10) {
            searchPost();
        }
    });
    //点击日期标题
    $(".list-top-left a").on("click", function () {
        if (!$(this).hasClass("current")) {
            $(this).addClass("current").siblings().removeClass("current");
            $("#SortBy").val($(this).attr("sort"));
            searchPost();
        }
    });
});
//ajax请求数据
function requestData() {
    $.ajax({
        url: $('#filterForm')[0].action,   //发送请求的地址
        type: $('#filterForm')[0].method,  //请求方式
        data: $('#filterForm').serialize(),//发送到服务器中的数据，序列化表单
        success: function (result) {        //请求成功后的回调函数
            var data = result.posts;
            $.each(data,function(key,value){
                var itemHtml;
                if (value.Source == "0"){
                    itemHtml = "<div class=\"blog-item\" uid=\""+value.Alias+"\"><h4><a href=\"/blog/"+value.CategoryAlias+"/"+value.Alias+"\" target=\"_blank\" title=\""+value.Title+"\">"+value.Title+"</a></h4><span titile=\"文章分类\"><i class=\"fa fa-map-signs\"></i><a href=\"/blog/"+value.CategoryAlias+"\" target=\"_blank\">"
                    +value.CateName+"</a></span><span class=\"margin-left-20\" title=\"发布时间\"><i class=\"fa fa-clock-o\"></i>"+value.PublishDate+"</span><p>"+encodeHtml(value.Summary)+"</p></div><div class=\"hr-line-dashed\"></div>";
                    
                }else{
                    itemHtml = "<div uid=\""
                    + value.Alias
                    + "\" class=\"blog-item \">"
                    + "    <h4>"
                    + "        <a title=\""
                    + value.Title
                    + "\" target=\"_blank\" href=\""
                    + value.Url
                    + "\">"
                    + "<i class=\"fa fa-link\"></i> " + value.Title
                    + "        <\/a>"
                    + "    <\/h4>"
                    + "    <span title=\"文章分类\">"
                    + "        <i class=\"fa fa-map-signs\">"
                    + "        <\/i>"
                    + "        "
                    + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>"
                    + "    <\/span>"
                    + "    <span title=\"发布时间\" class=\"margin-left-20\">"
                    + "        <i class=\"fa fa-clock-o\">"
                    + "        <\/i>"
                    + "        "
                    + value.PublishDate
                    + "    <\/span>"
                    + "    <a title=\""
                    + value.Host
                    + "\" target=\"_blank\" href=\""
                    + value.Url.substring(0, value.Url.indexOf("://") + 3) + value.Host
                    + "\" class=\"pull-right margin-left-20 hidden-xs\">"
                    + "        "
                    + "<i class=\"fa fa-globe\"></i> " + value.Host
                    + "    <\/a>"
                    + "    <div class=\"clearfix\">"
                    + "    <\/div>"
                    + "    <p>"
                    + "        "
                    + encodeHtml(value.Summary)
                    + "    <\/p>"
                    + "<\/div>"
                    + "<div class=\"hr-line-dashed\"></div>";
                }
                $(".list-wrap ol").append(itemHtml);
            });
        }
    });
}
//正则表达式，将HTML代码转义，防止代码被浏览器解析
function encodeHtml(s) {
    return (typeof s != "string") ? s :
        s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
            function ($0) {
                var c = $0.charCodeAt(0), r = ["&#"];//charCodeAt() 来获得字符串中某个具体字符的 Unicode 编码。
                c = (c == 0x20) ? 0xA0 : c;
                r.push(c);    //push()把一个元素添加到数组的尾部
                r.push(";");
                return r.join(""); //join()方法将数组中的所有元素转换成字符串，然后连接起来，这刚好和String的split()方法是一个相反的操作。join()默认是使用“,”作为分隔符，当然你也可以在方法中指定分隔符 
            });
};
//下拉按钮
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
            li[i].onclick=function(){
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
//searchPost
function searchPost(){
    $(".list-wrap ol").html("");
    requestData();
}