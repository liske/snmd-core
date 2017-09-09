define(["snmd-core/js/Polyfills","snmd-core/js/GUI","snmd-core/js/MQTT","snmd-core/js/SVGWidget","snmd-core/js/Sound","sprintf","jquery","js-logger","JSON.minify"],function(i,t,n,o,e,s,r,a,d){"use strict";var f=null,c=r("#snmd-title-label"),h=function(){if(null!==f)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.version="0.4.1",this.si_prefs=["T","G","M","k",""],this.si_facts=[Math.pow(10,12),Math.pow(10,9),Math.pow(10,6),Math.pow(10,3),1],this.genid=0,this.loadDiv=r("#snmd-load-div")};return h.getInstance=function(){return null===f&&(f=new h),f},h.prototype.srVersion=function(){return this.version},h.prototype.srURLParam=function(i,t){var n=new RegExp("[?&]"+i+"=([^&#/]*)([&#/]|$)").exec(window.location.href);return n&&n[1]?decodeURIComponent(n[1]):t},h.prototype.srConfigLoaded=function(i){this.config=i,this.config.view.title?c.text(this.config.view.title):c.text(window.location.host),void 0===this.config.mqttws_uri&&(this.config.mqttws_uri="ws://"+window.location.hostname+":9001/"),n.srInit(this.config.mqttws_uri);var o=r("#snmd-title div.snmd-dd-list");if(r.isArray(this.config.vlinks)&&this.config.vlinks.length>0){c.append(r("<sup></sup>").text(this.config.vlinks.length));var e=0;this.config.vlinks.forEach(function(i){var t=i.title||i.name;e=e>t.length?e:t.length,r("<a></a>").attr({href:"?config="+i.name}).text(t).appendTo(o)}),o.css("min-width",e+2+"em")}else o.remove();a.debug('[Core] Loading view "'+this.config.view.json+'"'),r.ajax({global:!1,url:this.config.view.json+"?nonce="+Math.random(),dataType:"json",dataFilter:function(i,t){return d.minify(i)},success:function(i){t.srInit(i)}.bind(this),error:function(i,t,n){a.error("[Core] Failed to load view list: "+t+" - "+n)}.bind(this)})},h.prototype.srInitLoad=function(i,t){a.debug("[Core] Loading view config: "+i),r.ajax({global:!1,url:i+"?nonce="+Math.random(),dataType:"json",dataFilter:function(i,t){return d.minify(i)},success:this.srConfigLoaded.bind(this),error:t})},h.prototype.snmdInit=function(i){if(a.info("[Core] snmd v"+this.version+" - Simple Network Management Dashboard"),"object"==typeof i.snmd_widgets){var t=function(i){a.info("[Core]  "+this.prefix+" => "+this.package+" v"+i.getVersion()),i.init(this.prefix,this.package)};i.snmd_widgets.forEach(function(n){var e={paths:{}};e.paths[n.package]=n.package+(!0===i.snmd_devel?"":"/dist"),require.config(e),require([n.package+"/js/Boot"],t.bind(n)),o.snmdRegisterPrefix(n.prefix,n.package)},this)}e.snmdLoadSet("default"),this.srInitLoad("configs/"+this.srURLParam("config","default")+".json",function(){this.srInitLoad("configs/default.json",function(i,t,n){a.error("[Core] Failed to load configuration: "+t+" - "+n)})}.bind(this))},h.prototype.snmdFinishLoading=function(i){if(void 0!==this.loadDiv){var t=this.loadDiv;this.loadDiv=void 0,t.fadeOut(3e3),window.setTimeout(function(){t.remove()},3e3)}},h.prototype.srSiFormatNum=function(i,t,n,o){if(void 0===i)return n;if(isNaN(i))return n;var e=0;i<0&&(i*=-1,e=1);var r,a=4;for(r=0;r<this.si_facts.length;r++)if(i>=.99*this.si_facts[r]){a=r;break}return i/=this.si_facts[a],(void 0===o||isNaN(o))&&(o=i<10&&this.si_facts[a]>1?1:0),e&&(i*=-1),s.sprintf("%."+o+"f%s%s",i,this.si_prefs[a],t)},h.prototype.srNagStateColor=function(i){return void 0===i?"var(--SNMD_undefined)":0===i?"var(--SNMD_ok)":1===i?"var(--SNMD_warning)":2===i?"var(--SNMD_critical)":"var(--SNMD_unknown)"},h.prototype.srGenID=function(i){return this.genid+=1,"snmd-genid-"+i+"-"+this.genid},h.getInstance()});