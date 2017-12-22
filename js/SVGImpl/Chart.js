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

define(["snmd-core/js/Core", "snmd-core/js/GUI", "js-logger", "jquery"], function (Core, GUI, Logger, $) {
    'use strict';

    var maxy_groups = {};
  
    var Chart = function (root, svg, opts, lines, qtip) {
        /* Meta data */
        this.opts = opts;
        this.lines = lines;

        /* Prepare line classes */
        var l;
        if (typeof this.opts.lcls !== "undefined") {
            for (l = 0; l < this.lines.length; l++) {
                var classes = this.opts.lcls.slice(0);
                var f = function (cl) {
                    classes.push(cl + "-" + this.lines[l].name);
                    classes.push(cl + "-" + l);
                };
                this.opts.lcls.forEach(f, this);
                this.lines[l].style = { 'class': classes.join(' ') };
            }
        }

        /* Scale graphs by group */
        if (typeof this.opts.desc.group === "undefined") {
            /* Prepare scaling line classes */
            if (typeof this.opts.mcls !== "undefined") {
                this.maxline_style =  {
                    'class': this.opts.mcls.join(' ')
                };
            }

            this.group_max = false;
        }
        else {
            this.group_max = true;
            this.group_view = root._container.id;
            this.group_name = this.opts.desc.group;
            this.group_widget = svg.id;
        }

        /* SVG container */
        this.root = root;

        /* Remove placeholder */
	    opts.dim =  {
            id: svg.id,
	        x: svg.x.baseVal.value,
	        y: svg.y.baseVal.value,
	        width: svg.width.baseVal.value,
	        height: svg.height.baseVal.value
	    };
        root.remove(svg);
        
        /* Create SVG background */
        this.rect = root.rect(
            opts.dim.x,
            opts.dim.y,
            opts.dim.width,
            opts.dim.height,
            {
                id: opts.dim.id,
                'class': opts.cls.base.join(' ')
	        }
        );

        /* Set qtip if available */
        if (typeof qtip !== "undefined") {
            var r = $(this.rect);
            r.addClass('snmd-bcl-Widget');
            r.qtip(qtip);
        }

        /* SVG text elements showing current values */
        this.txt = [
            root.text(opts.dim.x, opts.dim.y, '')
        ];
        if (lines.length > 1) {
            this.txt[1] = root.text(opts.dim.x + opts.dim.width, opts.dim.y, '');
        }
        for (l = 0; l < this.txt.length; l++) {
            if (typeof this.opts.tcls !== "undefined") {
                this.opts.tcls.forEach(function (cl) {
                    this.txt[l].classList.add(cl);
                    this.txt[l].classList.add(cl + "-" + this.lines[l].name);
                    this.txt[l].classList.add(cl + "-" + l);
                }, this);
            }
        }

        /* TS window: used to drop old data */
        this.data_tswin = (opts.dim.width - 6) / opts.dpi;
        /* Variables used for recording data points */
        this.data_ts = [];
        this.data_lines = [];
        this.data_svg = [];
        var i;
        for (i = 0; i < lines.length; i++) {
            this.data_lines[i] = [];
        }

        this.axis_maxlines = [];
        this.axis_maxlasts = [];
    };
    
    Chart.prototype.group_maxy = function(maxy) {
        if (typeof maxy_groups[this.group_view] === "undefined") {
            maxy_groups[this.group_view] = {};
        }

        if (typeof maxy_groups[this.group_view][this.group_name] === "undefined") {
            maxy_groups[this.group_view][this.group_name] = {};
        }

        maxy_groups[this.group_view][this.group_name][this.group_widget] = maxy;

        return Math.max.apply(null, Object.values( maxy_groups[this.group_view][this.group_name] ));
    };

    Chart.prototype.update = function (ts, data, state) {
        /* Record current data points */
        this.data_ts.push(ts);
        var maxy = (typeof this.opts.axis[0].max === "undefined" ? 0 : this.opts.axis[0].max);
        var i, v;
        for (i = 0; i < this.data_lines.length; i++) {
            v = data[i];
            if (typeof v !== "number" || isNaN(v)) {
                v = 0;
            }

            this.data_lines[i].push(v);
            maxy = Math.max(maxy, Math.max.apply(null, this.data_lines[i]));
        }

        /* Scale maxy by group. */
        if (this.group_max) {
            maxy = this.group_maxy(maxy);
        }

        /* Drop old data reaching TS window */
        var shift_ts;
        var shift_data = [];
        while (this.data_ts[0] < ts - this.data_tswin) {
            shift_ts = this.data_ts.shift();
            for (i = 0; i < this.data_lines.length; i++) {
                shift_data[i] = this.data_lines[i].shift();
            }
        }

        /* Linear approximate values at last visible timestamp */
        if (typeof shift_ts !== "undefined") {
            if (this.data_ts.length > 0) {
                var nts = ts - this.data_tswin;
                this.data_ts.unshift(nts);

                for (i = 0; i < this.data_lines.length; i++) {
                    this.data_lines[i].unshift(
                        shift_data[i] + (this.data_lines[i][0] - shift_data[i]) * (nts - shift_ts) / (this.data_ts[1] - shift_ts)
                    );
                }
            }
        }

        /* Axis scaling */
        if (typeof this.opts.axis[0].max !== "undefined") {
            if (this.axis_maxlasts[0] !== maxy) {
                this.axis_maxlasts[0] = maxy;
            }
        }

        /* Adjust max Y for log scale */
        if (this.opts.axis[0].scale === "log") {
            maxy = Math.log10(maxy);
        }

        /* Update chart with new lines */
	    var ox = this.opts.dim.x + this.opts.dim.width - 3;
	    var oy = this.opts.dim.y + this.opts.dim.height - 3;
	    var my = this.opts.dim.height - 20;
        var fy = my / maxy;
        var clean = [];
        var last = [];

        /* Axis max lines */
        if (!this.group_max && typeof this.opts.axis[0].max !== "undefined") {
            var numlines = (this.opts.axis[0].max < this.axis_maxlasts[0] ? Math.floor(this.axis_maxlasts[0] / this.opts.axis[0].max) : 0);
            for (i = 0; i < numlines; i++) {
                if (typeof this.axis_maxlines[i] !== "undefined") {
                    clean.push(this.axis_maxlines[i]);
                }

                var y = oy - (i + 1) * this.opts.axis[0].max * fy;
                this.axis_maxlines[i] = this.root.line(this.opts.dim.x, y, this.opts.dim.x + this.opts.dim.width, y, this.maxline_style);
            }
            if (this.axis_maxlines.length > numlines) {
                clean = clean.concat(this.axis_maxlines.splice(numlines, this.axis_maxlines.length - numlines));
            }
        }

        /* Data lines */
        var l;
        for (l = 0; l < this.data_lines.length; l++) {
            var points = [];
            var is_polygon = true;

            /* assume the line is just a polyline if the style does not apply a fill pattern */
            if (typeof this.data_svg[l] !== "undefined") {
                var style = window.getComputedStyle(this.data_svg[l]);
                if (style.fill === 'none' || style.fill === '') {
                    is_polygon = false;
                }
            }

            var t;
            for (t = 0; t < this.data_ts.length; t++) {
                var x = ox + (this.data_ts[t] - ts) * this.opts.dpi;

                if (is_polygon && t === 0) {
                    points.push([x, oy]);
                }

                v = this.data_lines[l][t];

                /* Prepare for log scale */
                if (this.opts.axis[0].scale === "log") {
                    if (v > 1) {
                        v = Math.log10(v);
                    } else {
                        v = 0;
                    }
                }
                v *= fy;

                points.push([x, oy - v]);

                if (t === this.data_ts.length - 1) {
                    if (is_polygon) {
                        points.push([x, oy]);
                    }

                    last[l] = this.data_lines[l][t];
                }
            }
            
            if (typeof this.data_svg[l] !== "undefined") {
                clean.push(this.data_svg[l]);
            }

            try {
                if (is_polygon) {
                    this.data_svg[l] = this.root.polygon(points, this.lines[l].style);
                } else {
                    this.data_svg[l] = this.root.polyline(points, this.lines[l].style);
                }
            } catch (err) {
                Logger.error("[Chart] Failed to create poly for " + this.rect.id);
            }

            if (typeof this.txt[l] !== "undefined") {
                this.txt[l].textContent = Core.srSiFormatNum(last[l], (typeof this.lines[l].unit === "undefined" ? '' : this.lines[l].unit), '-');
            }
        }

        /* Remove old lines */
        while (clean.length) {
            var s = clean.shift();
            this.root.remove(s);
        }

        if (state !== this.last_state && (!isNaN(state) || !isNaN(this.last_state))) {
            this.opts.cls.state.forEach(function (cl) {
                this.rect.classList.remove(cl + this.last_state);
            }, this);

            this.opts.cls.state.forEach(function (cl) {
                this.rect.classList.add(cl + state);
            }, this);
            
            this.last_state = state;

            GUI.srStateChanged(this.rect.parentElement.parentElement.id, this.rect.id, state);
        }
    };

    return Chart;
});
