define(["js-logger"],function(n){"use strict";var e=null,t=function(){if(null!==e)throw new Error("Cannot instantiate more than one instance, use getInstance()!")};return t.getInstance=function(){return null===e&&(e=new t),e},t.prototype.srLoadHTML=function(e,t,o){n.debug("Loading #"+e+": "+t);var i=$("<iframe>",{src:t,width:"95%",height:"95%",scrolling:"no"}).addClass("htmlview").appendTo($("#"+e));"undefined"!=typeof o&&window.setInterval(function(){i[0].contentWindow.location.reload(!1)},1e3*o)},t.getInstance()});
//# sourceMappingURL=dist/js/HTML.map