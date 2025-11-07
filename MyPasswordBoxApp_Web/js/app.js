/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// GLOBAL Variables
var USERINFO_G;
// GLOBAL Variables


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    
        console.log('Received Event: ' + id);

        //StatusBar.overlaysWebView(false);
        //StatusBar.backgroundColorByName('black');
        //alert("receivedEvent");
    }
};



//document.addEventListener('deviceready', function () {
//    StatusBar.overlaysWebView(false);
//    StatusBar.backgroundColorByName('black');    
//}, false);





$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = true;
    $.mobile.pushStateEnabled = false;
});


/*** encryption ***/
function getStaticEncryption(strValue, strLastName) {

    var strLastNamePassKey = reverseString(strLastName)
    var strEmailIV = CryptoJS.enc.Hex.parse('myIV');
    var strEmailKey = CryptoJS.enc.Hex.parse(strLastNamePassKey);
    var objEncypted = CryptoJS.AES.encrypt(strValue, strEmailKey, { iv: strEmailIV });

    return objEncypted.toString();
}

function getEncryption(strValue, strPassKey) {
    var objEncypted = CryptoJS.AES.encrypt(strValue, strPassKey);
    return objEncypted.toString();
}

function getDecryption(strValueEnc, strPassKey) {
    if (!strValueEnc) return '';
    var objDecypted = CryptoJS.AES.decrypt(strValueEnc, strPassKey);
    return objDecypted.toString(CryptoJS.enc.Utf8);
}


function getPassKeyString(strLastName, strBirthDate, strAdditionalKeyword) {
    return reverseString(strLastName) + "-" + reverseString(strBirthDate) + "-" + reverseString(strAdditionalKeyword);
}

function reverseString(s) {
    return s.split("").reverse().join("");
}

/*** End encryption ***/

/// convert string list to <UL> list
function convertToUnorderedlist(itemList) {
    var uoList = [];
    uoList.push("<ul>")
    for (i = 0; i < itemList.length; i++) {
        uoList.push('<li>' + itemList[i] + '</li>');
    }
    uoList.push("</ul>")
    return uoList.join('');
}


// get Parameter value by ID from Querystring
function getParameterByName(ID) {
    var questionTypeID = RegExp('[?&]' + ID + '=([^&]*)').exec(window.location.search);
    return questionTypeID && decodeURIComponent(questionTypeID[1].replace(/\+/g, ' '));
}


/** Alert Dialog **/
function showErrorDialog(alertTitle, alertSubTitle, alertMessage, button, callback) {
    console.log('showErrorDialog -  1')
    $("#divAlert .alertTitle").html(alertTitle);
    $("#divAlert .alertSubTitle").html(alertSubTitle);
    $("#divAlert .alertMessage").html(alertMessage);
    if (button == "") {
        $("#btnOK").hide();
        $("#btnClose").show();
    }
    else {
        $("#btnOK").show();
        $("#btnClose").hide();
        $("#btnOK").text(button).unbind("click").on("click", function () {

            $(this).off("click.sure");
            //$('#divAlert').remove();
            callback(false);
        });
    }
    $.mobile.changePage("#divAlert");
    console.log('showErrorDialog -  10')

}



/************************/
/***** Data Process *****/
/************************/
function SaveSignedInStatus(strValue) {
    localStorage.setItem('IsSignedIn', JSON.stringify(strValue));

    if( strValue)
    {
        var userInfo = JSON.parse(sessionStorage.getItem("loggedUser"));
        localStorage.setItem('loggedUser', JSON.stringify(userInfo));
        //console.log('saved to localStorage -  SaveSignedInStatus')
    }
    
}
function GetSignedInStatus() {
    var IsSignedIn = JSON.parse(localStorage.getItem("IsSignedIn"));
    return IsSignedIn;
}


function SaveUserInfoData(strEmail, strEmailEncypted, strPassKey, intAccountID) {
    var userInfo = {
        "userEmail": strEmail,
        "userEmailEncrypted": strEmailEncypted,
        "userPasskey": strPassKey,
        "UserAccountID": intAccountID        
    };

    sessionStorage.setItem('loggedUser', JSON.stringify(userInfo));    
}

function GetUserInfoData() {
    var userInfo
    
    if (GetSignedInStatus()) {        
        userInfo = JSON.parse(localStorage.getItem("loggedUser"));        
    }
    else {
        userInfo = JSON.parse(sessionStorage.getItem("loggedUser"));        
    }
    return userInfo;
}

function RemoveUserInfoData() {
    localStorage.removeItem('IsSignedIn');
    localStorage.removeItem('loggedUser');
    sessionStorage.removeItem('loggedUser');
    //console.log(GetUserInfoData());
}



function SavePasswordResetInfoData(VerifyCode, userEmailEncrypted, userPasskey) {
    var PasswordResetInfo = {
        "VerifyCode": VerifyCode,
        "userEmailEnc": userEmailEncrypted,
        "userPasskey": userPasskey
    }
    
    if (GetSignedInStatus()) {
        localStorage.setItem('PasswordResetInfo', JSON.stringify(PasswordResetInfo));
    }
    else {
        sessionStorage.setItem('PasswordResetInfo', JSON.stringify(PasswordResetInfo));
    }
}

function GetPasswordResetInfoData() {
    var PasswordResetInfo
    if (GetSignedInStatus()) {
        PasswordResetInfo = JSON.parse(localStorage.getItem("PasswordResetInfo"));        
    }
    else {
        PasswordResetInfo = JSON.parse(sessionStorage.getItem("PasswordResetInfo"));        
    }
    return PasswordResetInfo;
}


function RemovePasswordResetInfoData() {
    localStorage.removeItem('PasswordResetInfo');
    sessionStorage.removeItem('PasswordResetInfo');
    //console.log(GetPasswordResetInfoData());
}



/************************/
/***** Data Process *****/
/************************/




/************************/
/********* AdMob ********/
/************************/
var AD_SHOW_LOG_COUNT = 3;
var admobid = {}
var IsAndroid = false, IsIOS = false;
if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
    IsAndroid = true;
} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios   ,
    IsIOS = true;
}


if (IsAndroid) {  // for android & amazon-fireos 
    admobid = {
        banner: 'ca-app-pub-9538653651128721/7580468091',                 
        interstitial: 'ca-app-pub-9538653651128721/9057201292',
    }
} else if (IsIOS) {  // for ios  //banner: 'ca-app-pub-3096564721783035/5321871304',
    admobid = {
        interstitial: 'ca-app-pub-9538653651128721/4487400892',
    }
}
else { // default for ios  //banner: 'ca-app-pub-3096564721783035/5321871304',
    admobid = {
        interstitial: 'ca-app-pub-9538653651128721/4487400892',
    }
}


document.addEventListener('deviceready', function () {
    
        if (typeof admob !== 'undefined') {
            
            if (IsAndroid) {
                admob.banner.config({
                    id: admobid.banner,
                    isTesting: false,
                    autoShow: true,
                })
                admob.banner.prepare()
            }             
            
            admob.interstitial.config({
                id: admobid.interstitial,
                isTesting: false,
                autoShow: false,
            })
            admob.interstitial.prepare()
        }
        
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByName('black');               
        
    }, false)

    function ShowAD() {
        if (typeof admob !== 'undefined')
            admob.interstitial.show()                    
    }

    document.addEventListener('admob.banner.events.LOAD_FAIL', function (event) {
        console.log(event)
    })

    document.addEventListener('admob.interstitial.events.LOAD_FAIL', function (event) {
        console.log(event)
    })

    document.addEventListener('admob.interstitial.events.LOAD', function (event) {
        console.log(event)        
    })

    document.addEventListener('admob.interstitial.events.CLOSE', function (event) {
        console.log(event)

        admob.interstitial.prepare()
    })

     
    $(document).on("pagebeforeshow", "#index", function () { 
        //alert("pagebeforeshow");
        //setTimeout(CheckToRunAD, 3000)
    });

    
    $(document).on('pagecontainershow', function (e, ui) {
        //alert("pagecontainershow");
        if (IsIOS)
            window.setTimeout(CheckToRunAD, 1000)
        else 
            window.setTimeout(CheckToRunAD, 2000)        
    });

    
    function CheckToRunAD()
    {        
        if (GetSignedInStatus()) {
            if (AD_IsTimeToShow()) {                
                if (typeof admob !== 'undefined')
                    admob.interstitial.show();                
            }                        
        }
        
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByName('black');
    }




    function AD_IsTimeToShow() {
        var isTimeToSHow = false;
        var adLogCount = parseInt(JSON.parse(localStorage.getItem("AdLogCount")));
        if (!adLogCount) adLogCount = 0;

        if (adLogCount >= AD_SHOW_LOG_COUNT) {
            isTimeToSHow = true;
            adLogCount = 0;
        }
        adLogCount += 1;
        localStorage.setItem('AdLogCount', JSON.stringify(adLogCount));
        //alert("AdLogCount: " + adLogCount);
        return isTimeToSHow;
    }

    /************************/
    /********* AdMob ********/
    /************************/
