
$(document).one('pageinit', '#index', function () {
    console.log("login.html pageinit");

    
    //alert("init");

    //$('#txtEmail').val("test@gmail.com");
    //$('#txtPassword').val("1231");
    //$('#txtLastName').val("aaa");
    //$('#birthMonth').val("1");
    //$('#birthDay').val("1");
    //$('#birthYear').val("1111");
    //$('#txtAdditionalKeyword').val("ain");

    console.log("login.html pageinit - changed");
});

//$("#verify").click(function (e) {
//    e.stopImmediatePropagation();
//    e.preventDefault();
//    //Do important stuff....
//});

function fnLogin() {
    console.log("btnLogin III is clicked");
    //$(':mobile-pagecontainer').pagecontainer('change', 'loginconfirm.html', { changeHash: false });
    //event.stopImmediatePropagation();
    //event.preventDefault();
    

    //alert("btnLogin III is clicked");
    //$.mobile.ajaxLinksEnabled = true;
    //$.mobile.changePage('loginconfirm.html');
    //location.replace('loginconfirm.html');
    //location.href = "loginconfirm.html";
    //return;

    $.mobile.loading('show');
    $("#btnLogin").text('please wait');
    
    //$(':mobile-pagecontainer').pagecontainer('change', 'index.html', { changeHash: false });
    //$.mobile.changePage("index.html", { changeHash: false, showLoadMsg: true, reloadPage: true, allowSamePageTransition: true, reverse: true });
    //$("body").pagecontainer("change", "index.html", { reload: true });

    var strEmail = $('#txtEmail').val();
    var strPassword = $('#txtPassword').val();
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
            errorList.push("Password should contian at least 1 number");
        if (!/[a-z]/.test(strPassword))
            errorList.push("Password should contain at least 1 lowercase character (a-z)");
        if (!/[A-Z]/.test(strPassword))
            errorList.push("Password should contain at least 1 uppercase character (A-Z)");
    }

    if (!strAdditionalKeyword) errorList.push("Security Key can not be empty. Please enter a word or number only you can remember.");
    else strAdditionalKeyword = strAdditionalKeyword.trim().toLowerCase();

    
    if (errorList.length > 0) {
        $.mobile.loading('hide');
        $("#btnLogin").text('Log in');
        console.log('validation error');
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
    
    //console.log(strEmailEncypted);
    //console.log(encodeURIComponent(strEmailEncypted));

    //https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/Q_AccountByUserName?UserName=wPON//zJ2JZbWj6UPaZT9PypW7eHFgosjmRkPdxubGU=@gmail.com&callback=aa
    var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/account/';
    var strURLParam = 'Q_AccountByUserName?';
    strURLParam += "UserName=" + encodeURIComponent(strEmailEncypted); 
    var strURL = strURLBase + strURLParam; //encodeURI(strURLParam)
    //console.log(strURL);

    jQuery.support.cors = true;    
    
    $.ajax({
        url: strURL,
        dataType: 'json',
        success: function (data) {
            $.mobile.loading('hide');
            $("#btnLogin").text('Log in');
            //console.log(data);            
            if (typeof data != 'undefined') {
                //console.log(data[0]);
                var intAccountID = data["AccountID"];
                var strPasswordFromDB = decodeURIComponent(data["Password"]);

                var strPassKey = getPassKeyString(strEmail, strEmail, strAdditionalKeyword);
                var strPasswordFromDBDecrypted = getDecryption(strPasswordFromDB, strPassKey);

                if (strPassword == strPasswordFromDBDecrypted) {

                    RemoveUserInfoData();

                    SaveUserInfoData(strEmail, strEmailEncypted, strPassKey, intAccountID);

                    $.mobile.loading('hide');
                    $("#btnLogin").text('Log in');
                    //$.mobile.navigate("itemlist.html", { transition: "slide" });
                    //$(":mobile-pagecontainer").pagecontainer("change", "itemlist.html");
                    //$(':mobile-pagecontainer').pagecontainer('change', 'loginconfirm.html', { changeHash: false });                                        
                    location.href = "loginconfirm.html";
                }
                else {
                    showErrorDialog("Login Error:",
                            "",
                            "Login information is not correct",
                            "",
                            "");
                }
            }
            else {
                $.mobile.loading('hide');
                showErrorDialog("Login Error:",
                        "",
                        "Login information is not correct",
                        "",
                        "");
            }

        },
        complete: function () {
            
        },
        error: function (jqXHR, error, errorThrown) {
            $.mobile.loading('hide');
            $("#btnLogin").text('Log in');
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

