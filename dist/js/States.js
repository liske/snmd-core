define([],function(){"use strict";var n=null,t=function(){if(null!==n)throw new Error("Cannot instantiate more than one instance, use getInstance()!")};return t.getInstance=function(){return null===n&&(n=new t),n},t.prototype.stateColor=function(n){return void 0===n?"var(--SNMD_undefined)":0===n?"var(--SNMD_ok)":1===n?"var(--SNMD_warning)":2===n?"var(--SNMD_critical)":"var(--SNMD_unknown)"},t.prototype.stateName=function(n){return void 0===n?"UNDEFINED":0===n?"OK":1===n?"WARNING":2===n?"CRITICAL":"UNKNOWN"},t.getInstance()});