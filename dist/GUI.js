define(["snmd-core/Core","snmd-core/HTML","snmd-core/SVG","moment","require","jquery","css!../../snmd-core/css/gui.css"],function(e,t,s,i,n,r){"use strict";var a=null,c=function(){if(null!==a)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.idCounter=0,this.TO_SCREEN=6e5,this.TO_SWITCH=3e4,this.screenState=0,this.viewStates={},this.viewFinalStates={},this.currentStep=0};return c.getInstance=function(){return null===a&&(a=new c),a},c.prototype.srScreenTimeOut=function(){0===this.screenState&&(this.screenState+=1,r(document.body).addClass("on-screensaver"));var e=this;r(".srViews").each(function(){var t,s=r(this).children(".srViewsNav").find("a"),i=0;for(t=0;t<s.length;t++)s[t].hash===e.currentView&&(i=t);i+=1,i>=s.length&&(i=0),s[i].click()}),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SWITCH)}.bind(this),c.prototype.srStateChanged=function(e,t,s){if(this.viewStates[e][t]=s,this.viewFinalStates[e]<s)this.viewFinalStates[e]=s,r("#switch-"+e).css("color",n("snmd-core/Core").srNagStateColor(this.viewFinalStates[e]));else if(this.viewFinalStates[e]>s){var i=s,a=this;Object.keys(this.viewStates[e]).forEach(function(t){a.viewStates[e][t]>i&&(i=a.viewStates[e][t])}),this.viewFinalStates[e]=i,r("#switch-"+e).css("color",n("snmd-core/Core").srNagStateColor(this.viewFinalStates[e]))}},c.prototype.srInit=function(e){var n=this;r(".srViews").each(function(){var i={},a=r(this).children(".srViewsNav");Object.keys(e).forEach(function(t){i[t]="srView-"+(this.idCounter+=1).toString(16),this.viewStates[i[t]]={},this.viewFinalStates[i[t]]=-1,a.append('<li><a id="switch-'+i[t]+'" href="#'+i[t]+'"><span>'+e[t].title+"</span></a></li>")},n);var c=r("#snmd-views"),o=360/Object.keys(e).length,h=0,l=Object.keys(e).length>1?953/Math.tan(Math.PI/Object.keys(e).length):0;Object.keys(e).forEach(function(n){switch(c.append('<div class="svgview" id="'+i[n]+'"></div>'),r(document.body).hasClass("enable-3d")&&r("#"+i[n]).css("transform","rotateY("+o*h+"deg) translateZ("+l+"px)"),e[n].render){case"html":t.srLoadHTML(i[n],e[n].url,e[n].reload);break;default:s.srLoadSVG(i[n],e[n].url)}h+=1}),r("#snmd-views").css("transform-origin","100% 50% 50%");var d=function(){var e=1;r(document.body).hasClass("enable-3d")&&r("#snmd-views").css("transform","scale("+e+") translateZ(-"+l+"px) rotateY("+-1*o*this.currenStep+"deg)")}.bind(this);if(a.find("a").click(function(){return console.debug("Viewing "+this.hash),n.currentView=this.hash,c.children().removeClass("current").filter(this.hash).removeClass("next").removeClass("prev").addClass("current"),r(n.currentView).prevAll().removeClass("next").addClass("prev"),r(n.currentView).nextAll().removeClass("prev").addClass("next"),a.find("a").removeClass("selected").filter(this).addClass("selected"),n.currenStep=r(n.currentView).prevAll().length,d(),!1}).filter(":first").click(),"undefined"!==window.location.hash){var u=parseInt(window.location.hash.replace(/^#srView-/,""),10)-1;a.find("a:eq("+u+")").click()}r("#snmd-ctrl").find("a").click(function(){return console.debug("Control: "+this.hash),!1}).filter(":first").click()},this),window.setInterval(function(){r("div#snmd_clock").text(i().format("YYYY-MM-DDTHH:mm:ssZZ"))},1e3),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),r(document).mousemove(function(){this.screenState=0,"undefined"!=typeof this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN),r(document.body).removeClass("on-screensaver"))}.bind(this)),r(document).keypress(function(e){if(this.screenState=0,"undefined"!=typeof this.screenTimeOut&&(window.clearTimeout(this.screenTimeOut),this.screenTimeOut=window.setTimeout(this.srScreenTimeOut,this.TO_SCREEN)),e.which>47&&e.which<58){var t=48===e.which?"10":String.fromCharCode(e.which);r('a[href="#srView-'+t+'"]').click()}}.bind(this))},c.getInstance()});
//# sourceMappingURL=dist/GUI.map