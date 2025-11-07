
$(document).on('pagebeforeshow', '#index', function () {
    //console.log("index pagebeforeshow");

    if (GetUserInfoData()) {
        //$(":mobile-pagecontainer").pagecontainer("change", "account.html");
        location.href = "account.html";
        return;
    }



    $(document).on("click", "#btnLogOut", function () {
        //sessionStorage.removeItem('loggedUser');
        //$('#lblUserName').val("");
        //console.log(sessionStorage.getItem("loggedUser"));
        //$(":mobile-pagecontainer").pagecontainer("change", "index.html");
    });





});

