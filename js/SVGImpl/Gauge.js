/*
SNMD - Simple Network Monitoring Dashboard
  https://github.com/DE-IBH/snmd/

Authors:
  Thomas Liske <liske@ibh.de>

Copyright Holder:
  2012 - 2013 (C) Thomas Liske [https://fiasko-nw.net/~thomas/]
  2014 - 2017 (C) IBH IT-Service GmbH [https://www.ibh.de/]

License:
  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this package; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
*/

/*jslint
    devel: true,
    plusplus: true,
    vars: true
*/

/*global
    define
*/

define(["snmd-core/js/GUI", "svgpathdata", "jquery"], function (GUI, SVGPathData, $) {
    'use strict';

    var Gauge = function (root, svg, opts, qtip) {
        /* Meta data */
        this.opts = opts;
        this.cls = opts.cls.base;

        /* SVG container */
        this.root = root;

        /* Remove placeholder */
	    this.opts.dim = {
            id: svg.id,
	        x: svg.x.baseVal.value,
	        y: svg.y.baseVal.value + svg.height.baseVal.value,
	        width: svg.width.baseVal.value,
	        height: svg.height.baseVal.value,
            
            cX: svg.x.baseVal.value + svg.width.baseVal.value / 2.0,
            cY: svg.y.baseVal.value + svg.height.baseVal.value / 2.0,
            rX: svg.width.baseVal.value / 2.0,
            rY: svg.height.baseVal.value / 2.0
	    };

        if (typeof this.opts.rot_max === "undefined") {
            this.opts.dim.rot_max = 359.999;
        } else {
            this.opts.dim.rot_max = parseFloat(this.opts.rot_max);
        }

        if (typeof this.opts.rot_offset === "undefined") {
            this.opts.dim.rot_offset = 180;
        } else {
            this.opts.dim.rot_offset = parseFloat(this.opts.rot_offset);
        }
        
        /* Create SVG background */
        root.remove(svg);
        var pathdata = new SVGPathData(this.arc(this.opts.dim.rot_max).join(" "));

        var lambda = (this.opts.dim.rX - this.opts.dim.rY)/(this.opts.dim.rX + this.opts.dim.rY);
        this.perimeter = parseInt( (this.opts.dim.rX + this.opts.dim.rY) * Math.PI * (1+(3 * Math.pow(lambda, 2)) / (10 + Math.sqrt(4 - 3 * Math.pow(lambda, 2)))) );
        this.last_stroke = '';
        this.last_val = -1;

        var el = this.root.path(pathdata.encode(), {
            'class': this.cls.map(function (cl) {
                return cl + '-BG';
            }).join(' ')
        });

        this.svg = this.root.path(pathdata.encode(), {
            id: this.opts.dim.id,
            'class': this.cls.join(' ')
        });

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            el = $(el);
            el.addClass('snmd-bcl-Widget');
            el.qtip(qtip);
        }
    };

    Gauge.prototype.pol2Cart = function (deg) {
        var rad = (deg + this.opts.dim.rot_offset) * Math.PI / 180.0;

        return {
            x: this.opts.dim.cX + (this.opts.dim.rX * Math.cos(rad)),
            y: this.opts.dim.cY + (this.opts.dim.rY * Math.sin(rad))
        };
    };

    Gauge.prototype.arc = function (deg){
        var start = this.pol2Cart(0);
        var end = this.pol2Cart(deg);
        var laf;
        if (deg > 180.0) {
          laf = 1;
        }
        else {
          laf = 0;
        }

        return [
            "M", start.x, start.y,
            "A", this.opts.dim.rX, this.opts.dim.rY, 0, laf, 1, end.x, end.y
        ];
    };
    
    Gauge.prototype.update = function (val, max, state) {
        if (val === this.last_val && state === this.last_state) {
            return;
        }

        var p = this.perimeter;
        if (val < max) {
            p *= val / max;
        }

        this.svg.style['stroke-dasharray'] = p + " " + (this.perimeter - p);

        if (state !== this.last_state) {
            this.opts.cls.state.forEach(function (cl) {
                this.svg.classList.remove(cl + this.last_state);
            }, this);

            this.opts.cls.state.forEach(function (cl) {
                this.svg.classList.add(cl + state);
            }, this);
        }
    
        this.last_val = val;

        if (state !== this.last_state) {
            this.last_state = state;

            GUI.srStateChanged(this.root._svg.parentElement.id, this.opts.dim.id, state);
        }
    };

    return Gauge;
});
