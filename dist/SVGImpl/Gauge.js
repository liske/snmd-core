define(["snmd-core/GUI","svgpathdata"],function(t,s){"use strict";var a=function(t,a,i,h,e){this.opts=i,this.lines=h,this.cls=i.cls.base,this.root=t,i.dim={id:a.id,x:a.x.baseVal.value,y:a.y.baseVal.value+a.height.baseVal.value,width:a.width.baseVal.value,height:a.height.baseVal.value},t.remove(a),this.pathdata=new s("m "+i.dim.x+","+i.dim.y+" a "+i.dim.width/2+","+i.dim.height+" 0 0 1 "+i.dim.width+",0"),"undefined"!=typeof e&&this.rect.qtip(e),this.last_stroke="",this.last_val=-1;var d=Math.PI;this.pathdata.commands[1].x=2*(1-Math.cos(d/2))*this.pathdata.commands[1].rX,this.pathdata.commands[1].y=-1*Math.sin(d)*this.pathdata.commands[1].rY,this.root.path(this.pathdata.encode(),{class:this.cls.map(function(t){return t+"-BG"}).join(" ")})};return a.prototype.update=function(s,a,i){if(s!==this.last_val||i!==this.last_state){s>a&&(s=a);var h=s/a*Math.PI;this.pathdata.commands[1].x=2*(1-Math.cos(h/2))*this.pathdata.commands[1].rX,this.pathdata.commands[1].y=-1*Math.sin(h)*this.pathdata.commands[1].rY,i!==this.last_state&&(this.opts.cls.state.forEach(function(t){var s=this.cls.indexOf(t+this.last_state);s>-1&&this.cls.splice(s,1)},this),this.opts.cls.state.forEach(function(t){this.cls.push(t+i)},this)),"undefined"!=typeof this.svg&&this.root.remove(this.svg),this.svg=this.root.path(this.pathdata.encode(),{id:this.opts.dim.id,class:this.cls.join(" ")}),this.last_val=s,i!==this.last_state&&(this.last_state=i,t.srStateChanged(this.root._svg.parentElement.id,this.opts.dim.id,i))}},a});
//# sourceMappingURL=dist/SVGImpl/Gauge.map