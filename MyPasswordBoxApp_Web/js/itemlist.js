$(document).on('pageinit', '#index', function () {

    console.log("pageinit - itemlist");
    //alert("pageinit - itemlist");
    var userInfo = GetUserInfoData();
    //alert(userInfo);
    if (!userInfo) {        
        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
        location.href = "login.html";
        return;
    }

    //var uri = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/Q_SiteByAccountID?accountID=1075&spTemp=&callback=aa';
    var strURLBase = 'https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/';
    var strURLParam = 'Q_SiteByAccountID?';
    strURLParam += "accountID=" + userInfo.UserAccountID;
    strURLParam += "&spTemp="
    var strURL = strURLBase + strURLParam;
    var strPassKey = userInfo.userPasskey;

    
    $.ajax({
        url: strURL,
        dataType: 'json',
        success: function (data) {
            var len = data.length;

            //alert(len);
            if (len == 0) $('#customList').hide();
            else $('#customList').show();
            
            for (var i = 0; i < len; i++) {
                var siteItem = {
                    "SiteID": data[i]["SiteID"],
                    "SiteName": data[i]["SiteName"],
                };
                var strListItem = '<li><a href="itemdetail.html?SiteID=' + siteItem.SiteID
                    + '"style="font-weight:normal"; rel="external" class="ui-btn ui-btn-icon-right ui-icon-carat-r">'
                    + getDecryption(siteItem.SiteName, strPassKey) + '</a></li>'
                $('#SiteList').append(strListItem);
            }

            //sort
            
            var items = $('#SiteList li').get();
            items.sort(function (a, b) {
                var keyA = $(a).text().toLowerCase();
                var keyB = $(b).text().toLowerCase();

                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            var ul = $('#SiteList');
            $.each(items, function (i, li) {
                ul.append(li);
            });

            $('#SiteList').listview({
                autodividers: true,                
            });

            $('#SiteList').listview('refresh');
            $('#SiteList').css('font-size', '50px');
        }
    });

    
});


