$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});

var sess = null;
var ws_port = $.getUrlVar('ws_port') || 8081;

_reconnect = function () {
    jQuery('#overlay').css({display: 'block'});
    jQuery('#counter').countDown({
        startNumber: 10,
        callBack: function(me) {
            if (sess) {
                return;
            }
            startWS();
        }
    });
};

jQuery.fn.countDown = function (settings,to) {
    settings = jQuery.extend({
        startOpacity: 0,
        endOpacity: 1,
        duration: 2000,
        startNumber: 2,
        endNumber: 0,
        callBack: function () { }
    }, settings);
    return this.each(function () {
        if(!to && to != settings.endNumber) { to = settings.startNumber; }
        jQuery(this).text(to).css('opacity',settings.startOpacity);
        jQuery(this).animate({
            'opacity': settings.endOpacity
        },settings.duration,'',function () {
            if (to > settings.endNumber + 2) {
                jQuery(this).css('opacity',settings.startOpacity).text(to - 1).countDown(settings,to - 2);
            } else {
                settings.callBack(this);
            }
        });

    });
};

onSessionOpen = function(sess) { };

onSessionLost = function() { };

startWS = function() {
    var url = "ws://" + window.location.hostname + ":" + ws_port;
    console.log('trying to reach ' + url);
    sess = new ab.Session(
        url,
        function() {
            console.log("connected to " + url);
            jQuery('#overlay').css({display: 'none'});
            onSessionOpen(sess);
        },
        function() {
            console.log("not connected to " + url);
            onSessionLost();
            sess = null;
            setTimeout(_reconnect, 1000);
        }
    );
};

window.onload = startWS;


function I(d) {
    return d;
}
function get_up_down_response(d, upstring, downstring) {
    if (d.state == "up") {
        return upstring;
    }
    return downstring;
}
function get_background_color(d) {
    return get_up_down_response(d, "#080", "#800");
}

