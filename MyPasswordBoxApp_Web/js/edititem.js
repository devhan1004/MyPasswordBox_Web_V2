
$(document).one('pageinit', '#index', function () {

    var userInfo = GetUserInfoData();
    if (!userInfo) {
        location.href = "login.html";
        return;
    }
    var strPassKey = userInfo.userPasskey;

    try {
        var strSiteID = getParameterByName("SiteID");
        console.log('Site ID:' + strSiteID);
        if (!strSiteID) return;

        //var uri = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/Q_SiteByID?ID=1&callback=aa';
        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'Q_SiteByID?';
        strURLParam += "ID=" + strSiteID;
        var strURL = strURLBase + strURLParam;
        console.log('URL:' + strURL);

        $.ajax({
            url: strURL,
            dataType: 'json',
            success: function (data) {
                if (!data || data.length === 0) {
                    alert("No data found for this site.");
                    return;
                }

                // ✅ Decode before decrypt
                var siteName = getDecryption(decodeURIComponent(data.SiteName), strPassKey);
                var siteUserName = getDecryption(decodeURIComponent(data.SiteUserName), strPassKey);
                var sitePassword = getDecryption(decodeURIComponent(data.SitePassword), strPassKey);
                var notes = getDecryption(decodeURIComponent(data.Notes), strPassKey);

                
                $("#txtSiteName").val(siteName);
                $("#txtUserName").val(siteUserName);
                $("#txtPassword").val(sitePassword);
                $("#txtNote").val(notes);

                return;
                
            }
        });

    } catch (e) {
        alert("Error, please go back and try it again");
        $(':mobile-pagecontainer').pagecontainer('change', 'itemlist.html', { changeHash: false });
    }
});
 
$(document).one("pagecreate", "#index", function () {

    $(document).on("click", "#btnSave", function () {
        $("#btnSave").text('please wait');        
        console.log("btnSave click - editItem");
 
        
        var strSiteName = $('#txtSiteName').val();
        var strUserName = $('#txtUserName').val();
        var strPassword = $('#txtPassword').val();
        var strNote = $('#txtNote').val();

        var errorList = [];

        if (!strSiteName) errorList.push("Site Name can not be empty.");
        else strSiteName = strSiteName.trim();

        if (!strUserName) errorList.push("User Name can not be empty.");
        else strUserName = strUserName.trim();

        if (!strPassword) errorList.push("Password can not be empty.");
        else strPassword = strPassword.trim();


        if (errorList.length > 0) {
            console.log('validation error');
            $("#btnSave").text('Save');
            showErrorDialog("Error:",
                            "Please correct the following:",
                            convertToUnorderedlist(errorList),
                            "",
                            "");
            return;
        }

        console.log("validation ok");
        var userInfo = GetUserInfoData();
        var strPassKey = userInfo.userPasskey;

        var strSiteNameEncrypted = getEncryption(strSiteName, strPassKey);
        var strUserNameEncrypted = getEncryption(strUserName, strPassKey);
        var strPasswordEncypted = getEncryption(strPassword, strPassKey);
        var strNoteEncypted = getEncryption(strNote, strPassKey);

        console.log(strUserNameEncrypted);
        console.log(strPasswordEncypted);
        console.log(strNoteEncypted);

        var strSiteID = getParameterByName("SiteID");

        ////https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/I_Site?AccountID=1075&lKUPSiteID=&siteName=amazontest&siteUserName=aaaa&sitePassword=1211&notes=&callback=aa
        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'U_Site?';        
        strURLParam += "siteID=" + strSiteID;
        strURLParam += "&AccountID=" + userInfo.UserAccountID;
        strURLParam += "&lKUPSiteID=";
        strURLParam += "&siteName=" + encodeURIComponent(strSiteNameEncrypted);
        strURLParam += "&siteUserName=" + encodeURIComponent(strUserNameEncrypted);
        strURLParam += "&sitePassword=" + encodeURIComponent(strPasswordEncypted);
        strURLParam += "&notes=" + encodeURIComponent(strNoteEncypted);
        
        var strURL = strURLBase + strURLParam;


        jQuery.support.cors = true;
        var bRet = false;
        $.ajax({
            url: strURL,
            dataType: 'json',
            success: function (data) {

                $("#btnSave").text('Save');

                console.log("opening confirmation");
                var confirmList = [];
                confirmList.push("Site Name: " +
                    "<span style='font-size:xx-small'>" + "~~~" + strSiteNameEncrypted.toString().substring(10, 40) + "~~~" + "</span>");
                confirmList.push("User Name: " +
                    "<span style='font-size:xx-small'>" + "~~~" + strUserNameEncrypted.toString() + "~~~" + "</span>");
                confirmList.push("Password: " +
                    "<span style='font-size:xx-small'>" + "~~~" + strPasswordEncypted.toString().substring(10, 40) + "~~~" + "</span>");
                confirmList.push("Note: " +
                    "<span style='font-size:xx-small'>" + "~~~" + strNoteEncypted.toString().substring(10, 40) + "~~~" + "</span>");


                showErrorDialog("Updated",
                    "Your information is successfully updated as encrypted. Here is the part of the encrypted content.",
                    convertToUnorderedlist(confirmList),
                    "OK",
                    function () {
                        bRet = true;
                        console.log('ok click function');
                        //$.mobile.navigate("itemlist.html", { transition: "slide" });
                        location.href = "itemlist.html";
                    });
                console.log("Finished confirmation");

            },
             
            error: function (xhr, status, error) {
                console.error("Failed to load site:", error);
                alert("Error loading site. Please try again.");
            }
        });

    });
});

