define(["jquery"],function(t){"use strict";var s=function(s,i,a,h){if(this.root=s,this.opts=a,this.el=i,this.opts.cls.base.forEach(function(t){this.el.classList.add(t)},this),void 0!==h){var e=t(this.el);e.addClass("snmd-bcl-Widget"),e.qtip(h)}};return s.prototype.update=function(t,s){if(s===this.last_state||isNaN(s)&&isNaN(this.last_state)||(this.opts.cls.state.forEach(function(t){this.el.classList.remove(t+this.last_state)},this),this.opts.cls.state.forEach(function(t){this.el.classList.add(t+s)},this),this.last_state=s),this.last_val!==t){var i=t/this.opts.max;this.el.style.transform=this.opts.transform.split("%").join(i),this.last_val=t}},s});