/*
SNMD - Simple Network Monitoring Dashboard
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

define(["jquery"], function ($) {
    'use strict';

    var Class = function (root, svg, opts, qtip) {
        /* Root SVG */
        this.root = root;

        /* Meta data */
        this.opts = opts;
        
        /* SVG element */
        this.el = svg;
        this.opts.cls.base.forEach(function (cl) {
            this.el.classList.add(cl);
        }, this);

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            var e = $(svg);
            e.addClass('snmd-bcl-Widget');
            e.qtip(qtip);
        }
    };
    
    Class.prototype.update = function (state) {
        if (state === this.last_state) {
            return;
        }
        
        this.opts.cls.state.forEach(function (cl) {
            this.el.classList.remove(cl + this.last_state);
        }, this);

        this.opts.cls.state.forEach(function (cl) {
            this.el.classList.add(cl + state);
        }, this);

        this.last_state = state;
    };

    return Class;
});
