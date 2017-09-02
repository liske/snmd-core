define(["snmd-core/js/Core","snmd-core/js/HTML","snmd-core/js/Sound","snmd-core/js/SVG","snmd-core/js/Polyfills","require","jquery","sprintf","js-cookie","js-logger","qtip2","css!qtip2"],function(e,t,s,i,n,a,r,o,c,d){"use strict";var l=null,h=function(){if(null!==l)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.idCounter=0,this.TO_SCREEN=6e5,this.TO_SWITCH=3e4,this.screenState=0,this.viewStates={},this.viewFinalStates={},this.navbarState=0,this.currentStep=0,this.views={},this.views2id={},this.enabledScreenTO=!0,this.enableRotation=!1,this.enableFollow=!0,this.ctrlButtons={"3d":{shortcut:"d".charCodeAt(),title:"Toggle 3D view.",state:0,states:[{facls:"low-vision",descr:"Disable 3D view (increases performance).",cb:function(){this.snmdInit3D(!1)}},{facls:"eye",descr:"Enable 3D view (decreased performance).",cb:function(){this.snmdInit3D(!0)}}]},solarized:{shortcut:"s".charCodeAt(),title:"Switch solarized theme.",state:0,states:[{facls:"moon-o",descr:"Switch theme to solarized dark.",cb:function(){this.snmdSolarizedDark()}},{facls:"sun-o",descr:"Switch theme to solarized light.",cb:function(){this.snmdSolarizedLight()}}]},volume:{shortcut:"v".charCodeAt(),title:"Toggle alert sounds.",state:0,states:[{facls:"volume-up",descr:"Enable notification sounds.",cb:function(){s.snmdUnmute()}},{facls:"volume-off",descr:"Disable notification sounds.",cb:function(){s.snmdMute()}}]},rotate:{shortcut:"r".charCodeAt(),title:"Toggle interval or continuous view rotation.",state:0,states:[{facls:"repeat",descr:"Rotate view after activity timeout.",cb:function(){this.enabledScreenTO=!0,this.enableRotation=!1}},{facls:"circle-o-notch",descr:"Keep current view.",cb:function(){this.enabledScreenTO=!1,this.enableRotation=!1}},{facls:"refresh",descr:"Continuous view rotation.",cb:function(){this.enabledScreenTO=!1,this.enableRotation=!0,this.srScreenTimeOut()}}]},follow:{shortcut:"f".charCodeAt(),title:"Toggle current view follows state changes.",state:0,states:[{facls:"crosshairs",descr:"Switch to views if there state changes at least warning.",cb:function(){this.enableFollow=!0}},{facls:"stop-circle-o",descr:"Do not switch to views due to state changes.",cb:function(){this.enableFollow=!1}}]}},n.snmdUsePolyfill("cssVars")&&delete this.ctrlButtons.solarized};return h.getInstance=function(){return null===l&&(l=new h),l},h.prototype.srScreenTimeOut=function(){var e=a("snmd-core/js/GUI");e.enabledScreenTO?(0===e.screenState&&(e.screenState+=1,r(document.body).addClass("on-screensaver")),r("#snmd-nav").each(function(){var t,s=r(this).children(".srViewsNav").find("a"),i=0;for(t=0;t<s.length;t++)if(s[t].hash===e.currentView){i=t;break}(i+=1)>=s.length&&(i=0),s[i].click()}),e.screenTimeOut=window.setTimeout(e.srScreenTimeOut,e.TO_SWITCH)):e.screenTimeOut=window.setTimeout(e.srScreenTimeOut,e.TO_SWITCH)},h.prototype.snmdStateUpdate=function(e,t,i,n){if(i!==n&&(r("#switch-"+e).addClass("snmd-scl-"+n).removeClass("snmd-scl-"+i),r("#"+e).addClass("snmd-scl-"+n).removeClass("snmd-scl-"+i),n>0&&this.enableFollow&&(this.screenState=0,void 0!==this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN)),r("#switch-"+e).click()),(-1===r.inArray(i,[-1,3])||n>0)&&s.snmdPlay("default","state-"+n),this.navbarState!==n)){var a=this.navbarState,o=n,c=this;Object.keys(this.viewFinalStates).forEach(function(e){c.viewFinalStates[e]>o&&(o=c.viewFinalStates[e])}),o!==a&&(r("#snmd-nav").addClass("snmd-scl-"+o).removeClass("snmd-scl-"+a),this.navbarState=o)}},h.prototype.srStateChanged=function(e,t,s){this.viewStates[e][t]=s;var i=this.viewFinalStates[e];if(this.viewFinalStates[e]<s)this.viewFinalStates[e]=s,this.snmdStateUpdate(e,t,i,this.viewFinalStates[e]);else if(this.viewFinalStates[e]>s){var n=s,a=this;Object.keys(this.viewStates[e]).forEach(function(t){a.viewStates[e][t]>n&&(n=a.viewStates[e][t])}),this.viewFinalStates[e]=n,this.snmdStateUpdate(e,t,i,this.viewFinalStates[e])}},h.prototype.snmdInit3D=function(e){if(void 0===e&&(e=r(document.body).hasClass("snmd-in-3d")),e){r(document.body).addClass("snmd-in-3d").removeClass("snmd-in-2d");var t=360/Object.keys(this.views).length,s=Object.keys(this.views).length>1?953/Math.tan(Math.PI/Object.keys(this.views).length):0,i=0;Object.keys(this.views).forEach(function(e){r("#"+this.views2id[e]).css("transform","rotateY("+t*i+"deg) translateZ("+s+"px)"),i+=1},this),this.snmdAlignView(s,-t*this.currenStep)}else r(document.body).addClass("snmd-in-2d").removeClass("snmd-in-3d"),Object.keys(this.views).forEach(function(e){r("#"+this.views2id[e]).css("transform","")},this),r("#snmd-views").css("transform","")},h.prototype.snmdSolarizedDark=function(){r(document.body).addClass("solarized-dark").removeClass("solarized-light")},h.prototype.snmdSolarizedLight=function(){r(document.body).addClass("solarized-light").removeClass("solarized-dark")},h.prototype.snmdAlignView=function(e,t){r(document.body).hasClass("snmd-in-3d")&&r("#snmd-views").css("transform","translateZ(-"+e+"px) rotateY("+t+"deg)")},h.prototype.snmdNavRel=function(e){var t,s=r("#snmd-nav").children(".srViewsNav").find("a"),i=0;for(t=0;t<s.length;t++)if(s[t].hash===this.currentView){i=t;break}for(i+=e;i<0;)i+=s.length;s[i%s.length].click()},h.prototype.srInit=function(e){this.views=e;var s=this;r("#snmd-nav").each(function(){var n=r(this).children(".srViewsNav");Object.keys(e).forEach(function(e){this.views2id[e]="srView-"+(this.idCounter+=1).toString(16),this.viewStates[this.views2id[e]]={},this.viewFinalStates[this.views2id[e]]=-1;var t=r("<span></span>").text('Switch to view "'+this.views[e].title+'".');r('<li><a id="switch-'+this.views2id[e]+'" href="#'+this.views2id[e]+'" class="snmd-nav-switch"><span>'+this.views[e].title+"</span></a></li>").qtip({content:{text:parseInt(e,10)>9?t:r("<div></div>").append(r('<div class="snmd-nav-key"></div>').text((parseInt(e,10)+1)%10)).append(t)}}).appendTo(n)},s);var a=r("#snmd-views"),o=360/Object.keys(e).length,l=0,h=Object.keys(e).length>1?953/Math.tan(Math.PI/Object.keys(e).length):0;Object.keys(e).forEach(function(n){switch(a.append('<div class="svgview" id="'+s.views2id[n]+'"></div>'),e[n].render){case"html":t.srLoadHTML(s.views2id[n],s.views[n].url,s.views[n].reload);break;default:i.srLoadSVG(s.views2id[n],s.views[n].url)}l+=1}),s.snmdInit3D(),n.find("a").click(function(){return d.debug("[GUI] Viewing "+this.hash),s.currentView=this.hash,a.children().removeClass("current").filter(this.hash).removeClass("next").removeClass("prev").addClass("current"),r(s.currentView).prevAll().removeClass("next").addClass("prev"),r(s.currentView).nextAll().removeClass("prev").addClass("next"),n.find("a").removeClass("selected").filter(this).addClass("selected"),s.currenStep=r(s.currentView).prevAll().length,s.snmdAlignView(h,-o*s.currenStep),window.location.hash="#"+(s.currenStep+1),!1});var u;if(r("#snmd-views").on("transitionend",function(){void 0!==u&&(window.clearTimeout(u),u=void 0),s.enableRotation&&(u=window.setTimeout(function(){r("#snmd-nav").each(function(){var e,t=r(this).children(".srViewsNav").find("a"),i=0;for(e=0;e<t.length;e++)t[e].hash===s.currentView&&(i=e);(i+=1)>=t.length&&(i=0),t[i].click()})},5e3))}),""!==window.location.hash){var v=parseInt(window.location.hash.replace(/^#/,""),10)-1,f=n.find("a:eq("+v%e.length+")");0===f.length?n.find("a").filter(":first").click():f.click()}else n.find("a").filter(":first").click();var m=r("ul.snmd-ctrl").empty();Object.keys(s.ctrlButtons).forEach(function(e){var t=s.ctrlButtons[e],i=r("<i></i>").addClass("fa fa-"+t.states[t.state].facls),n=r("<span></span>").append(r('<div class="snmd-nav-key"></div>').text(String.fromCharCode(t.shortcut))).append(r("<span></span>").text(t.title)),a=r("<ul class='snmd-nav-icolist'></ul>");t.states.forEach(function(e){var t=r("<i></i>").addClass("fa fa-"+e.facls),s=r("<span></span>").text(e.descr);a.append(r("<li></li>").append(t).append(s))});var o=r("<a></a>").attr({href:"#"+e}).append(i).click(function(){return i.removeClass("fa-"+t.states[t.state].facls),t.state=(t.state+1)%t.states.length,i.addClass("fa-"+t.states[t.state].facls),t.states[t.state].cb.call(s),c.set("snmd-ctrl-"+e,t.state),!1}).qtip({content:{title:n,text:a}});s.ctrlButtons[e].button=o;var d=c.get("snmd-ctrl-"+e);void 0!==d&&(i.removeClass("fa-"+t.states[t.state].facls),t.state=parseInt(d,10)%t.states.length,i.addClass("fa-"+t.states[t.state].facls),t.states[t.state].cb.call(s)),m.append(r("<li></li>").append(o))})},this);var n=r("div#snmd_clock");n&&window.setInterval(function(){var e=new Date,t=-e.getTimezoneOffset(),s=t>=0?"+":"-";t=Math.abs(t);var i=o.sprintf("%d-%02d-%02dT%02d:%02d:%02d%s%02d%02d",e.getFullYear(),e.getMonth()+1,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),s,t/60,t%60);n.text(i)},1e3),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),r(document).mousemove(function(){this.enableRotation||(this.screenState=0,void 0!==this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),r(document.body).removeClass("on-screensaver")))}.bind(this)),r(document).keydown(function(e){if(this.screenState=0,void 0!==this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN)),37===e.keyCode||39===e.keyCode)this.snmdNavRel(37===e.keyCode?-1:1);else if(38===e.keyCode||40===e.keyCode){var t=r("#snmd-nav").children(".srViewsNav").find("a");t[40===e.keyCode?0:t.length-1].click()}}.bind(this)),r(document).keypress(function(e){if(e.which>47&&e.which<58){var t=48===e.which?"a":String.fromCharCode(e.which);return r('a[href="#srView-'+t+'"]').click(),void e.preventDefault()}Object.keys(s.ctrlButtons).forEach(function(t){if(s.ctrlButtons[t].shortcut===e.which)return s.ctrlButtons[t].button.click(),void e.preventDefault()})}.bind(this)),r(document).on("swipeleft",function(){this.snmdNavRel(1)}.bind(this)),r(document).on("swiperight",function(){this.snmdNavRel(-1)}.bind(this))},h.getInstance()});