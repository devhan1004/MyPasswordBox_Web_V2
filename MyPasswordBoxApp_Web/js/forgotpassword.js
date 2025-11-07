
$(document).on('pageinit', '#index', function () {
    console.log("forgotpassword.html pageinit");
        
    //$('#txtEmail').val("test@gmail.com");
    //$('#birthMonth').val("1");
    //$('#birthDay').val("1");
    //$('#birthYear').val("1111");
    //$('#txtAdditionalKeyword').val("aa");
});

// JQUERY MOBILE INIT
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = true;
});

$(document).one("pagecreate", "#index", function () {
    $(document).on("click", "#btnSubmit", function () {
        console.log("btnSubmit is clicked");

        var strEmail = $('#txtEmail').val();
        var strBirthMonth = $('#birthMonth').val();
        var strBirthDay = $('#birthDay').val();
        var strBirthYear = $('#birthYear').val();
        var strBirthDate = strBirthMonth + "/" + strBirthDay + "/" + strBirthYear;
        var strAdditionalKeyword = $('#txtAdditionalKeyword').val();

        //validation start

        ///declare array list for errors
        var errorList = [];

        if (!strEmail) errorList.push("Email address can not be empty.");
        else strEmail = strEmail.trim();
        if (!strEmail.indexOf("@") == -1) errorList.push("Invalid email address, try again.");

        
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
        var strBirthDateEncypted = getEncryption(strBirthDate, strPassKey);

        //https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/Q_AccountByUserName?UserName=wPON//zJ2JZbWj6UPaZT9PypW7eHFgosjmRkPdxubGU=@gmail.com&callback=aa
        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/';
        var strURLParam = 'Q_AccountByUserName?';
        strURLParam += "UserName=" + encodeURIComponent(strEmailEncypted);
        var strURL = strURLBase + strURLParam;
        console.log(strURL);

        jQuery.support.cors = true;
        var bRet = false;

        $.ajax({
            url: strURL,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (typeof data[0] !== 'undefined') {
                    //console.log(data[0]);
                    var intAccountID = data[0]["AccountID"];
                    var strBirthdayFromDB = decodeURIComponent(data[0]["Birthday"]);

                    var strPassKey = getPassKeyString(strEmail, strEmail, strAdditionalKeyword);
                    var strBirthdayFromDBDecrypted = getDecryption(strBirthdayFromDB, strPassKey);

                    //console.log(strBirthDate);
                    //console.log(strBirthdayFromDBDecrypted);
                    if (strBirthDate == strBirthdayFromDBDecrypted) {

                        bRet = true;

                    }
                    else {
                        showErrorDialog("Error:",
                                "",
                                "No match has been found. Please try again.",
                                "",
                                "");
                    }
                }
                else {
                    showErrorDialog("Error:",
                            "",
                            "Information is not correct. Please try again.",
                            "",
                            "");
                }

            },
            complete: function () {
                if (bRet = true)
                    SendVerficationCode(strEmail, strPassKey, strEmailEncypted);
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


        return;


    });
});




function SendVerficationCode(strEmail, strPassKey, strEmailEncypted) {
    var PasswordResetCode = Math.floor((Math.random() * (9999 - 2000)) + 2000);
    console.log("send verification code");

    var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/';
    var strURLParam = 'SendVerificationCode?';
    strURLParam += "SendTo=" + strEmail;
    strURLParam += "&VeriCode=" + PasswordResetCode;
    var strURL = strURLBase + strURLParam;
    console.log(strURL);

    jQuery.support.cors = true;

    $.ajax({
        url: strURL,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (typeof data !== 'undefined'
                && data.indexOf("Success!") != -1) {

                SavePasswordResetInfoData(PasswordResetCode, strEmailEncypted, strPassKey)

                //$.mobile.navigate("verifycode.html");
                location.href = "verifycode.html";
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


}