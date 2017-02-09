define(["snmd-core/js/MQTT","require","js-logger"],function(e,t,n){"use strict";var s=null,i=function(){if(null!==s)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.widgetPrefixes={},this.ReWidgetName=/^([\w\-]+):([\w\-]+)$/};return i.getInstance=function(){return null===s&&(s=new i),s},i.prototype.srClassOpts=function(e,t){var n={base:["snmd-bcl-"+t],state:["snmd-scl-","snmd-scl-"+t+"-"]};return"undefined"!=typeof e.type&&n.base.push("snmd-bcl-"+e.type.replace(":","_")),"undefined"!=typeof e.bcls&&n.base.push.apply(n.base,e.bcls),"undefined"!=typeof e.bcl&&n.base.push(e.bcl),"undefined"!=typeof e.scls&&n.state.push.apply(n.state,e.scls),"undefined"!=typeof e.scl&&n.state.push(e.scl),n},i.prototype.snmdRegisterPrefix=function(e,t){this.widgetPrefixes[e]=t},i.prototype.srCreateWidget=function(s,i,r){if("undefined"==typeof r.type)return void n.error("[SVGWidget] Widget "+i.id+" has no type set!");var d=this.ReWidgetName.exec(r.type);if(d){if("undefined"==typeof this.widgetPrefixes[d[1]])return void n.error("[SVGWidget] Widget package prefix "+d[1]+"/ is unknown!");t([this.widgetPrefixes[d[1]]+"/js/"+d[2]],function(t){try{var d=new t(s,i,r);"undefined"!=typeof r.topics&&r.topics.forEach(function(t){e.srRegisterTopic(t,d)})}catch(o){return void n.error("[SVGWidget] Failed to create widget "+i.id+" of type "+r.type+": "+o.message)}})}else n.error("[SVGWidget] Widget "+i.id+" has a invalid syntax for 'type'!")},i.getInstance()});
//# sourceMappingURL=dist/js/SVGWidget.map