require.config({map:{"*":{css:"require-css"}},paths:{moment:"moment/min/moment.min",sprintf:"sprintf/src/sprintf","jquery.svg":"snmd-core/lib/svg-1.5.0/jquery.svg.min","jquery.svggraph":"snmd-core/lib/svg-1.5.0/jquery.svggraph.min",svgpathdata:"snmd-core/lib/svgpathdata-1.0.3/SVGPathData",paho:"snmd-core/lib/paho.javascript-1.0.2/mqttws31-min",push:"push.js/push.min","require-css":"require-css/css.min","js-cookie":"js-cookie/src/js.cookie",qtip2:"qtip2/dist/jquery.qtip.min",howler:"howler.js/dist/howler.core.min"},shim:{"jquery.svg":["jquery"],"jquery.svggraph":["jquery.svg","jquery"],paho:{exports:"Paho"}}}),define([],function(){"use strict";return function(s){require(["snmd-core/js/Core"],function(r){r.snmdInit(s)})}});