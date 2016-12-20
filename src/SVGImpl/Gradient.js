/*
SNMD - Scotty Network Management Dashboard
  https://github.com/DE-IBH/snmd/

Authors:
  Thomas Liske <liske@ibh.de>

Copyright Holder:
  2012 - 2013 (C) Thomas Liske [https://fiasko-nw.net/~thomas/]
  2014 - 2016 (C) IBH IT-Service GmbH [https://www.ibh.de/]

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

define(["snmd-core/Core"], function (Core) {
    'use strict';

    var Gradient = function (root, svg, opts, qtip) {
        /* Meta data */
        this.opts = opts;

        /* SVG container */
        this.root = root;
        this.svg = svg;

        /* SVG element */
        opts.cls.base.forEach(function (cl) {
            this.svg.classList.add(cl);
        }, this);

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            this.svg.qtip(qtip);
        }

        var s = [];
        var stop;
        for (stop in this.opts.stops) {
            s.push([this.opts.stops[stop], '#404040']);
        }

        this.grad = root.linearGradient(null, Core.srGenID('lgrd'), s, this.opts.coords[0], this.opts.coords[1], this.opts.coords[2], this.opts.coords[3]);

        this.stops = {};
        var i = 0;
        for (stop in this.opts.stops) {
            this.stops[this.opts.stops[stop]] = this.grad.childNodes[i];
            i++;
        }

        svg.style.fill = 'url(#' + this.grad.id + ')';
        opts.cls.base.forEach(function (cl) {
            svg.classList.add(cl);
            this.grad.classList.add(cl);
        }, this);
    };

    Gradient.prototype.update = function (stops, state) {
        if (typeof stops === 'undefined') {
            return;
        }

        var stop;
        for (stop in stops) {
            if (typeof stops[stop] !== "undefined") {
                this.stops[stop].setAttribute('stop-color', 'hsl(' + stops[stop] + ',100%,50%)');
            } else {
                this.stops[stop].setAttribute('stop-color', '#404040');
            }
        }
    };

    return Gradient;
});
