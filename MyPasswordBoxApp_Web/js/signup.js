
$(document).on('pagebeforeshow', '#index', function () {

    //$('#txtEmail').val("test@gmail.com");
    //$('#txtPassword').val("Test1234");
    //$('#txtConfirmPassword').val("Test1234");
    //$('#birthMonth').val("1");
    //$('#birthDay').val("1");
    //$('#birthYear').val("1111");

});




//$(document).bind("ready", function () {
$(document).one("pagecreate", "#index", function () {

    $(document).on("click", "#btnSubmit", function () {

        var strEmail = $('#txtEmail').val();
        var strPassword = $('#txtPassword').val();
        var strConfirmPassword = $('#txtConfirmPassword').val();
        var strBirthMonth = $('#birthMonth').val();
        var strBirthDay = $('#birthDay').val();
        var strBirthYear = $('#birthYear').val();
        var strBirthDate = strBirthMonth + "/" + strBirthDay + "/" + strBirthYear;
        var strAdditionalKeyword = $('#txtAdditionalKeyword').val();

        //validation start

        ///declare array list for errors
        var errorList = [];

        if (!strEmail) errorList.push("Email address can not be empty.");
        else strEmail = strEmail.trim().toLowerCase();;
        if (!strEmail.indexOf("@") == -1) errorList.push("Invalid email address, try again.");
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
        
        if (!$.isNumeric(strBirthMonth) || !$.isNumeric(strBirthDay) || !$.isNumeric(strBirthYear))
            errorList.push("Your birthday is not valid.");

        if (!strAdditionalKeyword) errorList.push("Security Key can not be empty. Please enter a word or number only you can remember.");
        else strAdditionalKeyword = strAdditionalKeyword.trim().toLowerCase();
        
        if (errorList.length > 0) {
            showErrorDialog("Error:",
                            "Please correct the following:",
                            convertToUnorderedlist(errorList),
                            "",
                            "");            
            return;
        }
        //validation end

        var strEmailEncypted = getStaticEncryption(strEmail, strAdditionalKeyword);
        var strPassKey = getPassKeyString(strEmail, strEmail, strAdditionalKeyword);
        var strPasswordEncypted = getEncryption(strPassword, strPassKey);
        var strBirthDateEncypted = getEncryption(strBirthDate, strPassKey);

        //console.log(strEmailEncypted);
        //console.log(encodeURIComponent(strEmailEncypted));

        //var strPasswordFromDBDecrypted = getDecryption(strPasswordEncypted, strPassKey);
        //alert(strPasswordFromDBDecrypted);

        //https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/AccountSPs?UserName=devhan2@gmail.com&Password=test1111&Birthday=1/1/2016&spType=I_Account
        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/';
        var strURLParam = 'AccountSPs?';
        //strURLParam += "UserName=" + encodeURIComponent(strEmailEncypted);
        strURLParam += "UserName=" + encodeURIComponent(strEmailEncypted);
        strURLParam += "&Password=" + encodeURIComponent(strPasswordEncypted);
        strURLParam += "&Birthday=" + encodeURIComponent(strBirthDateEncypted);
        strURLParam += "&spType=I_Account";
        var strURL = strURLBase + strURLParam;

        //console.log("before signup");
        //console.log(strPasswordEncypted);
        //console.log(encodeURIComponent(strPasswordEncypted));


        jQuery.support.cors = true;
        var bRet = false;
        $.ajax({
            url: strURL,
            dataType: 'json',
            success: function (data) {
                var len = data.length;
                var intAccountID = data;
                if (data == "-1") {
                    var alertMsgList = [];

                    showErrorDialog("Error:",
                                    "Your Email already exists.",
                                    convertToUnorderedlist(alertMsgList),
                                    "",
                                    "");
                }
                else if (data == '-2') {
                    var alertMsgList = [];

                    showErrorDialog("Error:",
                                    "Your information failed to save, Please try it again.",
                                    convertToUnorderedlist(alertMsgList),
                                    "",
                                    "");
                }
                else {

                    var confirmList = [];
                    confirmList.push("Email: " +
                                     "<span style='font-size:xx-small'>" + "~~~" + strEmailEncypted.toString().substring(10, 40) + "~~~" + "</span>");
                    confirmList.push("Password: " +
                                     "<span style='font-size:xx-small'>" + "~~~" + strPasswordEncypted.toString().substring(10, 40) + "~~~" + "</span>");
                    confirmList.push("Birthday: " +
                                     "<span style='font-size:xx-small'>" + "~~~" + strBirthDateEncypted.toString().substring(10, 40) + "~~~" + "</span>");
                    confirmList.push("Extra Keyword: <span style='font-size:xx-small'>Not saved</span>");

                    showErrorDialog("Saved",
                                    "Your information is successfully saved as encrypted. Here is the part of the encrypted content.",
                                    convertToUnorderedlist(confirmList),
                                    "OK",
                                    function () {
                                        bRet = true;
                                        console.log('ok click function');
                                        //$.mobile.navigate("login.html", { transition: "slide" });
                                        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
                                        //location.href = "login.html";

                                        RemoveUserInfoData();

                                        SaveUserInfoData(strEmail, strEmailEncypted, strPassKey, intAccountID);
                                        location.href = "loginconfirm.html";

                                    });

                }

            },
            complete: function () {
                //if (bRet = true)
                    
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




        //return;


    });
});








