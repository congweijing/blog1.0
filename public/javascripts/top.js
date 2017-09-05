$(function(){
 	//分享到
    $("ul.fixed-tool li.share-li").show();
    $("#shareBtn").on("click",function(){
        if(!$(".qrcontain").is(":hidden")){
            $(".qrcontain").hide();
            $("#qrBtn").removeClass("opened");
        }
        if($(".sharecontain").is(":hidden")){
            //$(".sharecontain").addClass("fadeInLeft").removeClass("fadeOutLeft");
            $(".sharecontain").show();
            $("#shareBtn").addClass("opened");
            $(".sharecontain i.fa").addClass("bounce");
        }else{
            //$(".sharecontain").addClass("fadeOutLeft").removeClass("fadeInLeft");
            //$(".sharecontain").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){
                $(".sharecontain").hide();
                $("#shareBtn").removeClass("opened");
                $(".sharecontain i.fa").removeClass("bounce");
            //})
            
        }
    })
    


    //二维码
    $("ul.fixed-tool li.qr-li").show();
    $("#qrBtn").on("click",function(){
        if(!$(".sharecontain").is(":hidden")){
            $(".sharecontain").hide();
            $("#shareBtn").removeClass("opened");
        }
    	if($(".qrcontain").is(":hidden")){
            $(".qrcontain").addClass("fadeInLeft").removeClass("fadeOutLeft");
    		$(".qrcontain").show();
            $("#qrBtn").addClass("opened");
    	}else{
            $(".qrcontain").addClass("fadeOutLeft").removeClass("fadeInLeft");
            $(".qrcontain").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){
                $(".qrcontain").hide();
                $("#qrBtn").removeClass("opened");
            })
    		
    	}
    })   
    //var img = document.createElement("img");
    //img.src =  '../images/profile_photo.jpg';
    //img.onload = function () {
        $("#qrcode").qrcode({
            text: window.location.href,
            size: "100",
            ecLevel: 'H',
            minVersion: 4,
            //mode: 4,
            //image: img,
            mSize: 0.3
        });
    //};
    
    
    //回到顶部
	$("#scrollTop").show();
	$(window).scroll(function(){
		var scrollTop=$(window).scrollTop();
		if(scrollTop>0){
			$("#scrollTop").show();
            $(".qrcontain").css("top","-57px");
            $(".qrcontain .arrow").css("top","52%");
		}else{
			$("#scrollTop").hide();
            $(".qrcontain").css("top","-107px");
            $(".qrcontain .arrow").css("top","86%");
		}
	});
	$("#scrollTop a").on("click",function(){
		$("html,body").animate({scrollTop:0},800);
	})

});