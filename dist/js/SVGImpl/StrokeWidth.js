define(["jquery"],function(t){"use strict";var s=function(s,i,h,a){if(this.root=s,this.opts=h,this.el=i,this.opts.cls.base.forEach(function(t){this.el.classList.add(t)},this),this.el.style.stroke="",this.el.style.fill="",void 0!==a){var o=t(this.el);o.addClass("snmd-bcl-Widget"),o.qtip(a)}"log"===this.opts.scale&&(this.opts.max=Math.log2(this.opts.max))};return s.prototype.update=function(t,s){if(this.last_val!==t||this.last_state!==s){this.opts.cls.state.forEach(function(t){this.el.classList.remove(t+this.last_state)},this),this.opts.cls.state.forEach(function(t){this.el.classList.add(t+s)},this),this.opts.abs&&(t=Math.abs(t)),"log"===this.opts.scale&&(t=t<=2?1:Math.log2(t));var i=t*this.opts.width[1]/this.opts.max;i<this.opts.width[0]?i=this.opts.width[0]:i>this.opts.width[1]&&(i=this.opts.width[1]),this.el.style.strokeWidth=i,this.last_val=t,this.last_state=s}},s});