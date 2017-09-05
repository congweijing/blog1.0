$(function(){
	$("body").css('background','url(images/s1.jpg) no-repeat');
	$("body").css('background-size','100% 100%');
	$("#txtUserName").focus();
	$("#btnLogin").on("click",function(){
		verify();
	})
	$(document).on({
        keypress: function (e) {
            if (e.which === 13 || e.which === 10) {
                verify();
            }
        }
    }, "#txtUserName, #txtPwd");
})
function verify(){
	var userName = $("#txtUserName").val();
	var passWord = $("#txtPwd").val();
	if(!userName){
		//alert('请填写用户名!');
		$("#txtUserName").focus();
		return;
	} 
	if(!passWord){
		//alert('请填写密码');
		$("#txtPwd").focus();
		return;
	}
	$("#btnLogin").find("i").removeClass("fa-sign-in").addClass("fa-circle-o-notch fa-spin");
	$("#btnLogin").attr("disabled","disabled");
	$.ajax({
		url:"/login",
		method:"Post",
		data: {UserName :userName,PassWord:passWord},
		success:function(data){
			if(data.valid===true){
				window.location.href = data.returnTo;
			}else{
				alert("用户名或密码错误")
				$("#btnLogin").find("i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-sign-in");
                $("#btnLogin").removeAttr("disabled");
			}
		}
	})
}