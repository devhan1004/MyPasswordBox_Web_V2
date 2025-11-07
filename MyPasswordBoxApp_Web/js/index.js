 
$(document).on('pageinit', '#index', function () {

    console.log("index pageinit-2");    

    var userInfo = GetUserInfoData();
    //console.log(userInfo);
    //alert(userInfo);
    if (userInfo) {
        var userEmail = userInfo.userEmail;
        //alert(userEmail);

        $("#btnLogin").hide();
        $("#btnSignUp").hide();
        $("#btnLogOut").show();        
    }
    else {
        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");

        $("#btnLogin").show();
        $("#btnSignUp").show();
        $("#btnLogOut").hide();
        
        $("#divFootter").hide();
        //$("#liItemList").hide();
    }
    
    $(document).on("click", "#btnLogOut", function () {

        RemoveUserInfoData();
        //console.log(localStorage.getItem("loggedUser"));
        $("#btnLogin").show();
        $("#btnLogOut").hide();
        $("#btnSignUp").show();
    });

});



