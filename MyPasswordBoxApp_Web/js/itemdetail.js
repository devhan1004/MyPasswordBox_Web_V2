
$(document).on('pagebeforeshow', '#index', function () {
    var userInfo = GetUserInfoData();
    if (!userInfo) {
        location.href = "login.html";
        return;
    }
    var strPassKey = userInfo.userPasskey;

    try {
        var strSiteID = getParameterByName("SiteID");
        if (!strSiteID) {
            alert("Missing SiteID.");
            return;
        }

        //var uri = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/Q_SiteByID?ID=1&callback=aa';
        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'Q_SiteByID?';
        strURLParam += "ID=" + strSiteID;
        var strURL = strURLBase + strURLParam;
        
        $('#lnkEdit').attr('href', 'edititem.html?SiteID=' + strSiteID);
        $('#lnkEdit1').attr('href', 'edititem.html?SiteID=' + strSiteID);
        
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
                var userName = getDecryption(decodeURIComponent(data.SiteUserName), strPassKey);
                var password = getDecryption(decodeURIComponent(data.SitePassword), strPassKey);
                var notes = getDecryption(decodeURIComponent(data.Notes), strPassKey);


                 
                // ✅ Display decrypted values
                $("#lblSiteName").text(siteName);
                $("#lblUserName").text(userName);
                $("#lblUserEncPassword").text("~~~" + data.SitePassword.toString().substring(10, 20) + "~~~");
                $("#lblUserPassword").text(password);
                $("#lblNote").text(notes);

                // Hide password by default
                $("#lblUserEncPassword").hide();
                $("#lblUserPassword").hide();
            },
            error: function (xhr, status, error) {
                console.error("Failed to load site:", error);
                alert("Error loading site. Please try again.");
            }
        });

    } catch (e) {
        alert("Error, please try it again");
    }
});


// ✅ Delete handler
$(document).one("pagecreate", "#index", function () {


    $(document).on("click", "#btnDelete", function () {
        
        var userInfo = GetUserInfoData();
        var strSiteID = getParameterByName("SiteID");

        var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'D_SiteByID?';
        strURLParam += "AccountID=" + userInfo.UserAccountID
        strURLParam += "&siteID=" + strSiteID;
        var strURL = strURLBase + strURLParam;

       
        $.ajax({
            url: strURL,
            dataType: 'json',
            success: function (data) {
                console.log("success to delete data");

                console.log("opening confirmation");

                showErrorDialog("Deleted",
                    "Successfully Deleted.",
                    "",
                    "OK",
                    function () {
                        bRet = true;
                        console.log('ok click function');
                        /*$(':mobile-pagecontainer').pagecontainer('change', 'itemlist.html', { changeHash: false });*/
                        location.href = "itemlist.html";
                });
                console.log("Finished confirmation");
            },            
            error: function (jqXHR, error, errorThrown) {
                console.error("Delete failed:", jqXHR.responseText);
                alert("Error deleting site. Please try again.");
            }
        });
    });
});


// ✅ Password show/hide toggle
$("#pwSwitch").change(function () {
    if ($(this).is(":checked")) {
        $("#lblUserPassword").show();
    } else {
        $("#lblUserPassword").hide();
    }
});



// ✅ Edit button (optional navigation helper)
function fnEditItem() {
    var strSiteID = getParameterByName("SiteID");
    $(':mobile-pagecontainer').pagecontainer("change", "edititem.html?SiteID=" + strSiteID, { changeHash: false });
}