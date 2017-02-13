define(["snmd-core/js/Core","howler","jquery","js-logger"],function(n,t,o,s){"use strict";var e=null,d=function(){if(null!==e)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.snmdSoundSets={},this.snmdMuted=!1};return d.getInstance=function(){return null===e&&(e=new d),e},d.prototype.snmdLoadSetJSON=function(n,e){if("undefined"!=typeof e.sounds){this.snmdSoundSets[n]={};var d=this;o.each(e.sounds,function(o,e){s.info("[Sound]  %s => %s",o,e.toString()),d.snmdSoundSets[n][o]=new t.Howl({src:e})})}},d.prototype.snmdLoadSet=function(n){"undefined"==typeof this.snmdSoundSets[n]&&(s.info('[Sound] Loading sound set "%s"',n),o.ajax({global:!1,url:"snd/"+n+"/set.json",dataType:"json",dataFilter:function(n){return JSON.minify(n)},success:function(t){this.snmdLoadSetJSON(n,t)}.bind(this),error:function(n,t,o){s.error("[Sound] Failed to load set config: %s - %s",t,o)}}))},d.prototype.snmdPlay=function(n,t){return this.snmdMuted?void 0:"undefined"==typeof this.snmdSoundSets[n]?void s.warn("[Sound] Unable to play %s/%s: unknown sound set.",n,t):"undefined"==typeof this.snmdSoundSets[n][t]?void s.warn("[Sound] Unable to play %s/%s: sound is not part of the set.",n,t):void this.snmdSoundSets[n][t].play()},d.prototype.snmdMute=function(){this.snmdMuted=!0},d.prototype.snmdUnmute=function(){this.snmdMuted=!1},d.getInstance()});
//# sourceMappingURL=dist/js/Sound.map