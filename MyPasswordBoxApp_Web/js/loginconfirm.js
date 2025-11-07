 
$(document).on('pageinit', '#index', function () {
    console.log('loginconfirm - pageinit');    
    if (!GetUserInfoData()) {
        //$(":mobile-pagecontainer").pagecontainer("change", "login.html");
        location.href = "login.html";
        return;
    }
    //alert("loginconfirm - pageinit");

});

function fnContinue() {    
        console.log("fnContinue is clicked");

        var isSignedInChecked = $('#chkSignedIn').is(':checked');
        SaveSignedInStatus(isSignedInChecked);
        console.log("isSignedInChecked : " + isSignedInChecked);

        event.stopImmediatePropagation();
        event.preventDefault();
        //$(':mobile-pagecontainer').pagecontainer('change', 'itemlist.html', { changeHash: false });    
        location.href = "itemlist.html";
}