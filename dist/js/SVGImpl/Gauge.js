define(["snmd-core/js/GUI","svgpathdata","jquery"],function(t,s,i){"use strict";var a=function(t,a,o,h){this.opts=o,this.cls=o.cls.base,this.root=t,this.opts.dim={id:a.id,x:a.x.baseVal.value,y:a.y.baseVal.value+a.height.baseVal.value,width:a.width.baseVal.value,height:a.height.baseVal.value,cX:a.x.baseVal.value+a.width.baseVal.value/2,cY:a.y.baseVal.value+a.height.baseVal.value/2,rX:a.width.baseVal.value/2,rY:a.height.baseVal.value/2},void 0===this.opts.rot_max?this.opts.dim.rot_max=359.999:this.opts.dim.rot_max=parseFloat(this.opts.rot_max),void 0===this.opts.rot_offset?this.opts.dim.rot_offset=180:this.opts.dim.rot_offset=parseFloat(this.opts.rot_offset),t.remove(a);var e=new s(this.arc(this.opts.dim.rot_max).join(" ")),r=(this.opts.dim.rX-this.opts.dim.rY)/(this.opts.dim.rX+this.opts.dim.rY);this.perimeter=parseInt((this.opts.dim.rX+this.opts.dim.rY)*Math.PI*(1+3*Math.pow(r,2)/(10+Math.sqrt(4-3*Math.pow(r,2))))),this.last_stroke="",this.last_val=-1;var l=this.root.path(e.encode(),{class:this.cls.map(function(t){return t+"-BG"}).join(" ")});this.svg=this.root.path(e.encode(),{id:this.opts.dim.id,class:this.cls.join(" ")}),void 0!==h&&((l=i(l)).addClass("snmd-bcl-Widget"),l.qtip(h))};return a.prototype.pol2Cart=function(t){var s=(t+this.opts.dim.rot_offset)*Math.PI/180;return{x:this.opts.dim.cX+this.opts.dim.rX*Math.cos(s),y:this.opts.dim.cY+this.opts.dim.rY*Math.sin(s)}},a.prototype.arc=function(t){var s,i=this.pol2Cart(0),a=this.pol2Cart(t);return s=t>180?1:0,["M",i.x,i.y,"A",this.opts.dim.rX,this.opts.dim.rY,0,s,1,a.x,a.y]},a.prototype.update=function(s,i,a){if(s!==this.last_val||a!==this.last_state){s>i&&(s=i);var o=s/i*this.perimeter;this.svg.style["stroke-dasharray"]=o+" "+(this.perimeter-o),a!==this.last_state&&(this.opts.cls.state.forEach(function(t){this.svg.classList.remove(t+this.last_state)},this),this.opts.cls.state.forEach(function(t){this.svg.classList.add(t+a)},this)),this.last_val=s,a!==this.last_state&&(this.last_state=a,t.srStateChanged(this.root._svg.parentElement.id,this.opts.dim.id,a))}},a});