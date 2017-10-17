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

define(["snmd-core/js/Core", "snmd-core/js/GUI", "jquery"], function (Core, GUI, $) {
    'use strict';

    var Text = function (root, svg, opts, qtip) {
        /* Meta data */
        this.opts = opts;

        /* SVG container */
        this.root = root;

        /* SVG text element */
        this.txt = svg;
        this.txt.style.stroke = "";
        this.txt.style.fill = "";
        this.txt.textContent = "?";
        opts.cls.base.forEach(function (cl) {
            this.txt.classList.add(cl);
        }, this);

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            var e = $(this.txt);
            e.addClass('snmd-bcl-Widget');
            e.qtip(qtip);
        }
    };
    
    Text.prototype.update = function (val, state, formatNumeric) {
        if (this.last_val !== val) {
            if (typeof formatNumeric === "undefined") {
                formatNumeric = true;
            }

            /* Update text elements. */
            this.txt.textContent = (formatNumeric ? Core.srSiFormatNum(val, this.opts.uom, '-', this.opts.fracts) : val);
            this.last_val = val;
        }

        /* Add state classes. */
        if (state !== this.last_state && (!isNaN(state) || !isNaN(this.last_state))) {
            this.opts.cls.state.forEach(function (cl) {
                this.txt.classList.remove(cl + this.last_state);
            }, this);

            this.opts.cls.state.forEach(function (cl) {
                this.txt.classList.add(cl + state);
            }, this);

            this.last_state = state;

            GUI.srStateChanged(this.root._svg.parentElement.id, this.txt.id, state);
        }
    };

    return Text;
});
