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

define(["snmd-core/js/Core"], function (Core) {
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
        Object.keys(this.opts.stops).forEach(function (stop) {
            s.push([this.opts.stops[stop], 'rgba(64, 64, 64, 0)']);
        }, this);

        this.grad = root.radialGradient(null, Core.srGenID('rgrd'), s);

        this.stops = {};
        Object.keys(this.opts.stops).forEach(function (stop, i) {
            this.stops[this.opts.stops[stop]] = this.grad.childNodes[i];
        }, this);

        svg.style.fill = 'url(#' + this.grad.id + ')';
        opts.cls.base.forEach(function (cl) {
            svg.classList.add(cl);
            this.grad.classList.add(cl);
        }, this);
    };

    Gradient.prototype.update = function (stops, state) {
        if (state !== this.last_state) {
            this.opts.cls.state.forEach(function (cl) {
                this.svg.classList.remove(cl + this.last_state);
            }, this);

            this.opts.cls.state.forEach(function (cl) {
                this.svg.classList.add(cl + state);
            }, this);

            this.last_state = state;
        }

        if (typeof stops === 'object') {
            Object.keys(stops).forEach(function (stop) {
                if (typeof stops[stop] !== "undefined") {
                    this.stops[stop].setAttribute('stop-color', 'hsl(' + stops[stop] + ',100%,50%)');
                } else {
                    this.stops[stop].setAttribute('stop-color', 'rgba(64, 64, 64, 0)');
                }
            }, this);
        }
    };

    return Gradient;
});
