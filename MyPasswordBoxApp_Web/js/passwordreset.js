
$(document).one('pagebeforeshow', '#index', function () {
    console.log("passwordreset.html pageinit");
    
    var PasswordResetInfo = GetPasswordResetInfoData();

    if (!PasswordResetInfo) {
        console.log('PasswordResetInfo is empty.');
        //$(":mobile-pagecontainer").pagecontainer("change", "noaccount.html");        
        location.href = "noaccount.html";
    }    
});




//$(document).bind("ready", function () {
$(document).one("pagecreate", "#index", function () {

    $(document).on("click", "#btnSubmit", function () {
        console.log("btnSubmit is clicked in Password Reset")
        $("#btnSubmit").text('please wait');
        

        var PasswordResetInfo = GetPasswordResetInfoData();

        var strPassword = $('#txtPassword').val();
        var strConfirmPassword = $('#txtConfirmPassword').val();

        //validation start

        ///declare array list for errors
        var errorList = [];

        if (!strPassword) errorList.push("Password can not be empty.");
        else {
            strPassword = strPassword.trim();
            var validated = true;
            if (strPassword.length < 8)
                errorList.push("Password should contain at least 8 characters");
            if (!/\d/.test(strPassword))
                errorList.push("Password should contain at least 1 number");
            if (!/[a-z]/.test(strPassword))
                errorList.push("Password should contain at least 1 lowercase character (a-z)");
            if (!/[A-Z]/.test(strPassword))
                errorList.push("Password should contain at least 1 uppercase character (A-Z)");
        }

        if (!strConfirmPassword) errorList.push("Confirm password can not be empty.");
        else strConfirmPassword = strConfirmPassword.trim();

        if (strPassword && strConfirmPassword) {
            if (strPassword.toLowerCase() != strConfirmPassword.toLowerCase())
                errorList.push("Your password does not match, please enter your password again.");
        }

        if (errorList.length > 0) {
            $("#btnSubmit").text('Save');
            showErrorDialog("Error:",
                            "Please correct the following:",
                            convertToUnorderedlist(errorList),
                            "",
                            "");
            return;
        }

        console.log("PasswordResetInfo.strPassKey:" + PasswordResetInfo.userPasskey);
        //validation end        
        var strPassKey = PasswordResetInfo.userPasskey;
        var strPasswordEncypted = getEncryption(strPassword, strPassKey);
        console.log("strPasswordEncypted :" + strPasswordEncypted);

        //https://mypasswordboxweb-gkgma8bdcpdag7h5.eastus2-01.azurewebsites.net/api/account/AccountSPs?UserName=devhan2@gmail.com&Password=test1111&Birthday=1/1/2016&spType=I_Account
        var strURLBase = 'https://mypasswordboxweb-gkgma8bdcpdag7h5.eastus2-01.azurewebsites.net/api/account/';
        var strURLParam = 'U_AccountPasswordByUserName?';
        strURLParam += "userName=" + encodeURIComponent(PasswordResetInfo.userEmailEnc);
        strURLParam += "&Password=" + encodeURIComponent(strPasswordEncypted);
        strURLParam += "&strType=U_AccountPasswordByUserName";
        var strURL = strURLBase + strURLParam;

        //console.log("before signup");
        //console.log(strPasswordEncypted);
        //console.log(encodeURIComponent(strPasswordEncypted));


        jQuery.support.cors = true;
        var bRet = false;
        $.ajax({
            url: strURL,
            crossDomain: true,
            dataType: 'jsonp',
            success: function (data) {
                var len = data.length;
                bRet = true;
                console.log("Password changed: " + data);
            },
            complete: function () {
                console.log("bRet: " + bRet);
                if (bRet = true) {
                    var confirmList = [];

                    console.log("password has been successfully changed ");
                    RemovePasswordResetInfoData();
                    confirmList.push("New Password: " +
                                        "<span style='font-size:xx-small'>" + "~~~" + strPasswordEncypted.toString().substring(10, 40) + "~~~" + "</span>");

                    showErrorDialog("Updated",
                                    "Your password has been successfully changed and saved as encrypted. Here is the part of the encrypted data. Please login with new password",
                                    convertToUnorderedlist(confirmList),
                                    "OK",
                                    function () {
                                        //RemoveUserInfoData();                                        
                                        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
                                        //$(":mobile-pagecontainer").pagecontainer("change", "index.html", { changeHash: false });
                                        //$(":mobile-pagecontainer").pagecontainer("change", "account.html");
                                        location.href = "account.html";
                                    });

                }
            },
            error: function (jqXHR, error, errorThrown) {
                alert('Error');
                alert("Error: " + jqXHR.responseText +
                       ' : ' + errorThrown +
                       ' : ' + JSON.stringify(jqXHR));
                if (jqXHR.status && jqXHR.status == 400) {
                    //alert(jqXHR.responseText);
                } else {
                    //alert("error");
                }

            }
        });
        $("#btnSubmit").text('Save');

    });
});








