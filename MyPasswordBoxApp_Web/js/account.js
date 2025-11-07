
$(document).on('pagebeforeshow', '#index', function () {
    //console.log("index pagebeforeshow");

    var userInfo = GetUserInfoData();
    //console.log(userInfo);
    if (userInfo) {
        var userEmail = userInfo.userEmail;

        SavePasswordResetInfoData("", userInfo.userEmailEncrypted, userInfo.userPasskey)
        
        $('#lblUserName').text(userEmail);

    }
    else {
        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
        location.href = "login.html";
        return;
    }


    $(document).on("click", "#btnLogOut", function () {

        RemoveUserInfoData();
        $('#lblUserName').val("");        
        //$(":mobile-pagecontainer").pagecontainer("change", "index.html");
        location.href = "index.html";
    });


    $(document).on("click", "#btnPasswordChange", function () {
        console.log('btnPasswordChange cliced');

        var userInfo = GetUserInfoData();

        SavePasswordResetInfoData("", userInfo.userEmailEncrypted, userInfo.userPasskey)

        console.log('change page');
        //$(":mobile-pagecontainer").pagecontainer("change", "passwordreset.html");
        location.href = "passwordreset.html";
    });




});

