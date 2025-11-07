
$(document).on('pageinit', '#index', function () {
    console.log("VerfyCOde.html pageinit");
    //alert("init");


});

// JQUERY MOBILE INIT
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = true;
});


$(document).one("pagecreate", "#index", function () {
    $(document).on("click", "#btnVerifyCode", function () {
        console.log("btnVerifyCode is clicked");

        var strVerfificationCode = $('#txtVerfificationCode').val();
        console.log('txtVerfificationCode:' + strVerfificationCode);

        var PasswordResetInfo = GetPasswordResetInfoData();;
        console.log('PasswordResetInfo:' + PasswordResetInfo);
        console.log('PasswordResetInfo.VerifyCode:' + PasswordResetInfo.VerifyCode);

        if (PasswordResetInfo.VerifyCode
            && PasswordResetInfo.VerifyCode == strVerfificationCode) {

            console.log('passwordResetCode is correct');

            alert("Password Reset Code is matched");
            //$.mobile.navigate("passwordreset.html");
            location.href = "passwordreset.html";
        }
        else if (!PasswordResetInfo.VerifyCode) {
            alert("Your Password Reset Verification Code does not valid anymore. Please go to forgot password.")
        }
        else {
            alert("Your Password Reset Verification Code is not correct. Please try it again.")
        }

    });
});


