define([],function(r){"use strict";var s=function(r){require.config({baseUrl:"blib",map:{"*":{css:"require-css"}},paths:{sprintf:"sprintf/src/sprintf",jquery:"jquery/dist/jquery","jquery.svg":"snmd-core/lib/svg-1.5.0/jquery.svg.min","jquery.svggraph":"snmd-core/lib/svg-1.5.0/jquery.svggraph.min",svgpathdata:"snmd-core/lib/svgpathdata-1.0.3/SVGPathData",paho:"snmd-core/lib/paho.javascript-1.0.2/mqttws31-min","require-css":"snmd-core/blib/require-css/css"},shim:{"jquery.svg":["jquery"],"jquery.svggraph":["jquery.svg","jquery"],paho:{exports:"Paho"}},urlArgs:"bust=0.15a"}),require(["snmd-core/Core"],function(r){r.srInit()})};return s});
//# sourceMappingURL=dist/Main.map