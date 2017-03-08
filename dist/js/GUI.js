define(["snmd-core/js/Core","snmd-core/js/HTML","snmd-core/js/Sound","snmd-core/js/SVG","require","jquery","sprintf","js-cookie","js-logger","qtip2","css!qtip2"],function(e,t,s,i,n,a,r,o,c){"use strict";var d=null,l=function(){if(null!==d)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.idCounter=0,this.TO_SCREEN=6e5,this.TO_SWITCH=3e4,this.screenState=0,this.viewStates={},this.viewFinalStates={},this.navbarState=0,this.currentStep=0,this.views={},this.views2id={},this.enabledScreenTO=!0,this.enableRotation=!1,this.enableFollow=!0,this.ctrlButtons={"3d":{shortcut:"d".charCodeAt(),title:"Toggle 3D view.",state:0,states:[{facls:"low-vision",descr:"Disable 3D view (increases performance).",cb:function(){this.snmdInit3D(!1)}},{facls:"eye",descr:"Enable 3D view (decreased performance).",cb:function(){this.snmdInit3D(!0)}}]},solarized:{shortcut:"s".charCodeAt(),title:"Switch solarized theme.",state:0,states:[{facls:"square-o",descr:"Switch theme to solarized light.",cb:function(){this.snmdSolarizedLight()}},{facls:"square",descr:"Switch theme to solarized dark.",cb:function(){this.snmdSolarizedDark()}}]},volume:{shortcut:"v".charCodeAt(),title:"Toggle alert sounds.",state:0,states:[{facls:"volume-up",descr:"Enable notification sounds.",cb:function(){s.snmdUnmute()}},{facls:"volume-off",descr:"Disable notification sounds.",cb:function(){s.snmdMute()}}]},rotate:{shortcut:"r".charCodeAt(),title:"Toggle interval or continuous view rotation.",state:0,states:[{facls:"repeat",descr:"Rotate view after activity timeout.",cb:function(){this.enabledScreenTO=!0,this.enableRotation=!1}},{facls:"circle-o-notch",descr:"Keep current view.",cb:function(){this.enabledScreenTO=!1,this.enableRotation=!1}},{facls:"refresh",descr:"Continuous view rotation.",cb:function(){this.enabledScreenTO=!1,this.enableRotation=!0,this.srScreenTimeOut()}}]},follow:{shortcut:"f".charCodeAt(),title:"Toggle current view follows state changes.",state:0,states:[{facls:"crosshairs",descr:"Switch to views if there state changes at least warning.",cb:function(){this.enableFollow=!0}},{facls:"stop-circle-o",descr:"Do not switch to views due to state changes.",cb:function(){this.enableFollow=!1}}]}}};return l.getInstance=function(){return null===d&&(d=new l),d},l.prototype.srScreenTimeOut=function(){var e=n("snmd-core/js/GUI");return e.enabledScreenTO?(0===e.screenState&&(e.screenState+=1,a(document.body).addClass("on-screensaver")),a("#snmd-nav").each(function(){var t,s=a(this).children(".srViewsNav").find("a"),i=0;for(t=0;t<s.length;t++)if(s[t].hash===e.currentView){i=t;break}i+=1,i>=s.length&&(i=0),s[i].click()}),void(e.screenTimeOut=window.setTimeout(e.srScreenTimeOut,e.TO_SWITCH))):void(e.screenTimeOut=window.setTimeout(e.srScreenTimeOut,e.TO_SWITCH))},l.prototype.snmdStateUpdate=function(e,t,i,n){if(i!==n&&(a("#switch-"+e).addClass("snmd-scl-"+n).removeClass("snmd-scl-"+i),a("#"+e).addClass("snmd-scl-"+n).removeClass("snmd-scl-"+i),n>0&&this.enableFollow&&(this.screenState=0,"undefined"!=typeof this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN)),a("#switch-"+e).click()),(-1===a.inArray(i,[-1,3])||n>0)&&s.snmdPlay("default","state-"+n),this.navbarState!==n)){var r=this.navbarState,o=n,c=this;Object.keys(this.viewFinalStates).forEach(function(e){c.viewFinalStates[e]>o&&(o=c.viewFinalStates[e])}),o!==r&&(a("#snmd-nav").addClass("snmd-scl-"+o).removeClass("snmd-scl-"+r),this.navbarState=o)}},l.prototype.srStateChanged=function(e,t,s){this.viewStates[e][t]=s;var i=this.viewFinalStates[e];if(this.viewFinalStates[e]<s)this.viewFinalStates[e]=s,this.snmdStateUpdate(e,t,i,this.viewFinalStates[e]);else if(this.viewFinalStates[e]>s){var n=s,a=this;Object.keys(this.viewStates[e]).forEach(function(t){a.viewStates[e][t]>n&&(n=a.viewStates[e][t])}),this.viewFinalStates[e]=n,this.snmdStateUpdate(e,t,i,this.viewFinalStates[e])}},l.prototype.snmdInit3D=function(e){if("undefined"==typeof e&&(e=a(document.body).hasClass("snmd-in-3d")),e){a(document.body).addClass("snmd-in-3d").removeClass("snmd-in-2d");var t=360/Object.keys(this.views).length,s=Object.keys(this.views).length>1?953/Math.tan(Math.PI/Object.keys(this.views).length):0,i=0;Object.keys(this.views).forEach(function(e){a("#"+this.views2id[e]).css("transform","rotateY("+t*i+"deg) translateZ("+s+"px)"),i+=1},this),this.snmdAlignView(s,-t*this.currenStep)}else a(document.body).addClass("snmd-in-2d").removeClass("snmd-in-3d"),Object.keys(this.views).forEach(function(e){a("#"+this.views2id[e]).css("transform","")},this)},l.prototype.snmdSolarizedDark=function(){a(document.body).addClass("solarized-dark").removeClass("solarized-light")},l.prototype.snmdSolarizedLight=function(){a(document.body).addClass("solarized-light").removeClass("solarized-dark")},l.prototype.snmdAlignView=function(e,t){a(document.body).hasClass("snmd-in-3d")&&a("#snmd-views").css("transform","translateZ(-"+e+"px) rotateY("+t+"deg)")},l.prototype.srInit=function(e){this.views=e;var s=this;a("#snmd-nav").each(function(){var n=a(this).children(".srViewsNav");Object.keys(e).forEach(function(e){this.views2id[e]="srView-"+(this.idCounter+=1).toString(16),this.viewStates[this.views2id[e]]={},this.viewFinalStates[this.views2id[e]]=-1;var t=a("<span></span>").text('Switch to view "'+this.views[e].title+'".');a('<li><a id="switch-'+this.views2id[e]+'" href="#'+this.views2id[e]+'" class="snmd-nav-switch"><span>'+this.views[e].title+"</span></a></li>").qtip({content:{text:parseInt(e,10)>9?t:a("<div></div>").append(a('<div class="snmd-nav-key"></div>').text((parseInt(e,10)+1)%10)).append(t)}}).appendTo(n)},s);var r=a("#snmd-views"),d=360/Object.keys(e).length,l=0,h=Object.keys(e).length>1?953/Math.tan(Math.PI/Object.keys(e).length):0;Object.keys(e).forEach(function(n){switch(r.append('<div class="svgview" id="'+s.views2id[n]+'"></div>'),e[n].render){case"html":t.srLoadHTML(s.views2id[n],s.views[n].url,s.views[n].reload);break;default:i.srLoadSVG(s.views2id[n],s.views[n].url)}l+=1}),s.snmdInit3D(),n.find("a").click(function(){return c.debug("[GUI] Viewing "+this.hash),s.currentView=this.hash,r.children().removeClass("current").filter(this.hash).removeClass("next").removeClass("prev").addClass("current"),a(s.currentView).prevAll().removeClass("next").addClass("prev"),a(s.currentView).nextAll().removeClass("prev").addClass("next"),n.find("a").removeClass("selected").filter(this).addClass("selected"),s.currenStep=a(s.currentView).prevAll().length,s.snmdAlignView(h,-d*s.currenStep),!1}).filter(":first").click();var u;if(a("#snmd-views").on("transitionend",function(){"undefined"!=typeof u&&(window.clearTimeout(u),u=void 0),s.enableRotation&&(u=window.setTimeout(function(){a("#snmd-nav").each(function(){var e,t=a(this).children(".srViewsNav").find("a"),i=0;for(e=0;e<t.length;e++)t[e].hash===s.currentView&&(i=e);i+=1,i>=t.length&&(i=0),t[i].click()})},5e3))}),"undefined"!==window.location.hash){var v=parseInt(window.location.hash.replace(/^#srView-/,""),10)-1;n.find("a:eq("+v+")").click()}var f=a("ul.snmd-ctrl").empty();Object.keys(s.ctrlButtons).forEach(function(e){var t=s.ctrlButtons[e],i=a("<i></i>").addClass("fa fa-"+t.states[t.state].facls),n=a("<span></span>").append(a('<div class="snmd-nav-key"></div>').text(String.fromCharCode(t.shortcut))).append(a("<span></span>").text(t.title)),r=a("<ul class='snmd-nav-icolist'></ul>");t.states.forEach(function(e){var t=a("<i></i>").addClass("fa fa-"+e.facls),s=a("<span></span>").text(e.descr);r.append(a("<li></li>").append(t).append(s))});var c=a("<a></a>").attr({href:"#"+e}).append(i).click(function(){return i.removeClass("fa-"+t.states[t.state].facls),t.state=(t.state+1)%t.states.length,i.addClass("fa-"+t.states[t.state].facls),t.states[t.state].cb.call(s),o.set("snmd-ctrl-"+e,t.state),!1}).qtip({content:{title:n,text:r}});s.ctrlButtons[e].button=c;var d=o.get("snmd-ctrl-"+e);"undefined"!=typeof d&&(i.removeClass("fa-"+t.states[t.state].facls),t.state=parseInt(d,10)%t.states.length,i.addClass("fa-"+t.states[t.state].facls),t.states[t.state].cb.call(s)),f.append(a("<li></li>").append(c))})},this);var n=a("div#snmd_clock");n&&window.setInterval(function(){var e=new Date,t=-e.getTimezoneOffset(),s=t>=0?"+":"-";t=Math.abs(t);var i=r.sprintf("%d-%02d-%02dT%02d:%02d:%02d%s%02d%02d",e.getFullYear(),e.getMonth()+1,e.getDay(),e.getHours(),e.getMinutes(),e.getSeconds(),s,t/60,t%60);n.text(i)},1e3),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),a(document).mousemove(function(){this.enableRotation||(this.screenState=0,"undefined"!=typeof this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),a(document.body).removeClass("on-screensaver")))}.bind(this)),a(document).keydown(function(e){if(this.screenState=0,"undefined"!=typeof this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN)),37===e.keyCode||39===e.keyCode){var t,s=a("#snmd-nav").children(".srViewsNav").find("a"),i=0;for(t=0;t<s.length;t++)if(s[t].hash===this.currentView){i=t;break}i+=37===e.keyCode?-1:1,0>i&&(i+=s.length),i%=s.length,s[i].click()}else if(38===e.keyCode||40===e.keyCode){var n=a("#snmd-nav").children(".srViewsNav").find("a");n[40===e.keyCode?0:n.length-1].click()}}.bind(this)),a(document).keypress(function(e){if(e.which>47&&e.which<58){var t=48===e.which?"a":String.fromCharCode(e.which);return a('a[href="#srView-'+t+'"]').click(),void e.preventDefault()}Object.keys(s.ctrlButtons).forEach(function(t){var i=s.ctrlButtons[t];return i.shortcut===e.which?(s.ctrlButtons[t].button.click(),void e.preventDefault()):void 0})}.bind(this))},l.getInstance()});
//# sourceMappingURL=dist/js/GUI.map