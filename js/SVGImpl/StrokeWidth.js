/*
SNMP - Simple Network Monitoring Dashboard

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

define(["jquery"], function ($) {
    'use strict';

    var StrokeWidth = function (root, svg, opts, qtip) {
        /* Root SVG */
        this.root = root;

        /* Meta data */
        this.opts = opts;
        
        /* SVG element */
        this.el = svg;
        this.opts.cls.base.forEach(function (cl) {
            this.el.classList.add(cl);
        }, this);
        this.el.style.stroke = "";
        this.el.style.fill = "";

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            var e = $(this.el);
            e.addClass('snmd-bcl-Widget');
            e.qtip(qtip);
        }

        /* Adjust max for log scale */
        if (this.opts.scale === "log") {
            this.opts.max = Math.log2(this.opts.max);
        }
    };
    
    StrokeWidth.prototype.update = function (val, state) {
        if (this.last_val === val && this.last_state === state) {
            return;
        }
        
        this.opts.cls.state.forEach(function (cl) {
            this.el.classList.remove(cl + this.last_state);
        }, this);

        this.opts.cls.state.forEach(function (cl) {
            this.el.classList.add(cl + state);
        }, this);

        if (this.opts.abs) {
            val = Math.abs(val);
        }
        
        if (this.opts.scale === "log") {
            if (val <= 2) {
                val = 1;
            } else {
                val = Math.log2(val);
            }
        }

        var f = val * this.opts.width[1] / this.opts.max;
        if (f < this.opts.width[0]) {
            f = this.opts.width[0];
        } else {
            if (f > this.opts.width[1]) {
                f = this.opts.width[1];
            }
        }
        this.el.style.strokeWidth = f;
        
        this.last_val = val;
        this.last_state = state;
    };

    return StrokeWidth;
});
