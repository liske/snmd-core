define(["snmd-core/js/GUI","svgpathdata","jquery"],function(t,s,a){"use strict";var i=function(t,i,h,d){this.opts=h,this.cls=h.cls.base,this.root=t,h.dim={id:i.id,x:i.x.baseVal.value,y:i.y.baseVal.value+i.height.baseVal.value,width:i.width.baseVal.value,height:i.height.baseVal.value},t.remove(i),this.pathdata=new s("m "+h.dim.x+","+h.dim.y+" a "+h.dim.width/2+","+h.dim.height+" 0 0 1 "+h.dim.width+",0"),this.last_stroke="",this.last_val=-1;var e=Math.PI;this.pathdata.commands[1].x=2*(1-Math.cos(e/2))*this.pathdata.commands[1].rX,this.pathdata.commands[1].y=-1*Math.sin(e)*this.pathdata.commands[1].rY;var o=this.root.path(this.pathdata.encode(),{class:this.cls.map(function(t){return t+"-BG"}).join(" ")});void 0!==d&&((o=a(o)).addClass("snmd-bcl-Widget"),o.qtip(d))};return i.prototype.update=function(s,a,i){if(s!==this.last_val||i!==this.last_state){s>a&&(s=a);var h=s/a*Math.PI;this.pathdata.commands[1].x=2*(1-Math.cos(h/2))*this.pathdata.commands[1].rX,this.pathdata.commands[1].y=-1*Math.sin(h)*this.pathdata.commands[1].rY,i!==this.last_state&&(this.opts.cls.state.forEach(function(t){var s=this.cls.indexOf(t+this.last_state);s>-1&&this.cls.splice(s,1)},this),this.opts.cls.state.forEach(function(t){this.cls.push(t+i)},this)),void 0!==this.svg&&this.root.remove(this.svg),this.svg=this.root.path(this.pathdata.encode(),{id:this.opts.dim.id,class:this.cls.join(" ")}),this.last_val=s,i!==this.last_state&&(this.last_state=i,t.srStateChanged(this.root._svg.parentElement.id,this.opts.dim.id,i))}},i});