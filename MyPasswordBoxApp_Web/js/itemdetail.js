
$(document).on('pagebeforeshow', '#index', function () {
    //console.log("index pagebeforeshow");

    var userInfo = GetUserInfoData();
    //console.log(userInfo);
    if (userInfo) {
        var userEmail = userInfo.userEmail;
        //alert(userEmail);
    }
    else {
        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
        location.href = "login.html";
        return;
    }

    try {
        var strSiteID = getParameterByName("SiteID");

        //var uri = 'https://mypasswordboxweb-gkgma8bdcpdag7h5.eastus2-01.azurewebsites.net/api/site/Q_SiteByID?ID=1&callback=aa';
        var strURLBase = 'https://mypasswordboxweb-gkgma8bdcpdag7h5.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'Q_SiteByID?';
        strURLParam += "ID=" + strSiteID;
        var strURL = strURLBase + strURLParam;
        
        $('#lnkEdit').attr('href', 'edititem.html?SiteID=' + strSiteID);
        $('#lnkEdit1').attr('href', 'edititem.html?SiteID=' + strSiteID);
        
        $.ajax({
            url: strURL,
            crossDomain: true,
            dataType: 'jsonp',
            success: function (data) {
                var len = data.length;
                var siteItem = {
                    "SiteID": data[0]["SiteID"],
                    "SiteName": data[0]["SiteName"],
                    "SiteUserName": data[0]["SiteUserName"],
                    "SitePassword": data[0]["SitePassword"],
                    "Notes": data[0]["Notes"],
                };
                console.log(siteItem);
                var strPassKey = userInfo.userPasskey;

                $("#lblSiteName").text(getDecryption(siteItem.SiteName, strPassKey));
                $("#lblUserName").text(getDecryption(siteItem.SiteUserName, strPassKey));                
                $("#lblUserEncPassword").text("~~~" + siteItem.SitePassword.toString().substring(10, 20) + "~~~");
                $("#lblUserPassword").text(getDecryption(siteItem.SitePassword, strPassKey));
                $("#lblNote").text(getDecryption(siteItem.Notes, strPassKey));

                $("#lblUserEncPassword").hide();
                $("#lblUserPassword").hide();
            }
        });

    } catch (e) {
        alert("Error, please try it again");
    }
});


$(document).one("pagecreate", "#index", function () {

    //$(document).on("click", "#btnEdit", function () {
        
    //    var strSiteID = getParameterByName("SiteID");
    //    alert("edititem.html?SiteID=" + strSiteID);
    //    $(':mobile-pagecontainer').pagecontainer('change', "edititem.html?SiteID=" + strSiteID, { changeHash: false });

    //});


    $(document).on("click", "#btnDelete", function () {
        
        var userInfo = GetUserInfoData();
        var strSiteID = getParameterByName("SiteID");

        var strURLBase = 'https://mypasswordboxweb-gkgma8bdcpdag7h5.eastus2-01.azurewebsites.net/api/site/';
        var strURLParam = 'D_SiteByID?';
        strURLParam += "AccountID=" + userInfo.UserAccountID
        strURLParam += "&siteID=" + strSiteID;
        var strURL = strURLBase + strURLParam;

       
        jQuery.support.cors = true;
        var bRet = false;
        $.ajax({
            url: strURL,
            crossDomain: true,
            dataType: 'jsonp',
            success: function (data) {
                console.log("success to delete data");
                console.log(data);
                var len = data.length;
                if (data == '-2') {
                    var alertMsgList = [];

                    showErrorDialog("Error:",
                                    "Failed to delete, Please try it again.",
                                    convertToUnorderedlist(alertMsgList),
                                    "",
                                    "");
                }
                else {
                    console.log("opening confirmation");
                    
                    showErrorDialog("Saved",
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
                }

            },
            complete: function () {


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
    });
});


$("#pwSwitch").change(function () {
    var bChecked = $(this).is(":checked");
    if (bChecked)
    {
        //$("#lblUserEncPassword").hide();
        $("#lblUserPassword").show();
    }        
    else
    {
        //$("#lblUserEncPassword").show();
        $("#lblUserPassword").hide();
    }

});


function fnEditItem() {
    
    alert("fnEditItem is clicked");
    console.log("fnEditItem is clicked");

    var strSiteID = getParameterByName("SiteID");    

    //$.mobile.changePage("edititem.html?SiteID=" + strSiteID, { transition: "slideup", changeHash: false });

    $(':mobile-pagecontainer').pagecontainer("change", "edititem.html?SiteID=" + strSiteID, { changeHash: false });

}