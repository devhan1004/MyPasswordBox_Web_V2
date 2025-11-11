$(document).on('pageinit', '#index', function () {

    console.log("pageinit - itemlist");

    var userInfo = GetUserInfoData();
    if (!userInfo) {
        location.href = "login.html";
        return;
    }


    var $siteList = $('#SiteList').empty();
    var $loading = $('#loadingMessage');

    // Show loading message
    $loading.show();

    var strURL = `https://mypasswordbox-webandapi-v2-aqb2dmd6brd2ceaw.eastus2-01.azurewebsites.net/api/site/Q_SiteByAccountID?accountID=${userInfo.UserAccountID}&spTemp=`;
    var strPassKey = userInfo.userPasskey;

    $.ajax({
        url: strURL,
        dataType: 'json',
        success: function (data) {
            var $siteList = $('#SiteList').empty();

            // Hide loading message
            $loading.hide();

            if (!data || data.length === 0) {
                console.log("No sites found for this account.");
                $('#customList').hide();
                return;
            }

            $('#customList').show();

            // 🔹 Build a simple array of { id, name }
            var sites = [];

            data.forEach((item, index) => {
                try {
                    var decryptedName = getDecryption(decodeURIComponent(item.SiteName), strPassKey);                    

                    if (decryptedName && decryptedName.trim() !== "") {
                        sites.push({
                            id: item.SiteID,
                            name: decryptedName
                        });
                    }
                } catch (err) {
                    console.error("Error decrypting item at index " + index, item, err);
                }
            });

            // After decryption
            //sites = sites.filter(s => s.name && s.name.trim() !== "");


            // Sort alphabetically
            sites.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            );

            // Append
            sites.forEach(site => {
                $siteList.append(`
                    <li>
                        <a href="itemdetail.html?SiteID=${site.id}"
                           style="font-weight:normal"
                           rel="external"
                           class="ui-btn ui-btn-icon-right ui-icon-carat-r">
                           ${site.name}
                        </a>
                    </li>
                `);
            });

            // Refresh listview
            $siteList.listview({ autodividers: true }).listview('refresh');            
            $siteList.css('font-size', '50px');
        },
        error: function (xhr, status, error) {
            $loading.hide(); // hide on error too
            console.error("Failed to load sites:", error);
            alert("Unable to load sites. Please try again later.");
        }
    });

});
