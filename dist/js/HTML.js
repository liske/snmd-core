define(["jquery","js-logger"],function(n,e){"use strict";var t=null,o=function(){if(null!==t)throw new Error("Cannot instantiate more than one instance, use getInstance()!")};return o.getInstance=function(){return null===t&&(t=new o),t},o.prototype.srLoadHTML=function(t,o,i){e.debug("Loading #"+t+": "+o);var r=n("<iframe>",{src:o,width:"95%",height:"95%",scrolling:"no"}).addClass("htmlview").appendTo(n("#"+t));"undefined"!=typeof i&&window.setInterval(function(){r[0].contentWindow.location.reload(!1)},1e3*i)},o.getInstance()});
//# sourceMappingURL=dist/js/HTML.map