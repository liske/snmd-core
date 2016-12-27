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

define(["snmd-core/SVGWidget", "js-logger", "jquery", "jquery.svg", "jquery.svggraph", "css!snmd-core/../lib/svg-1.5.0/jquery.svg.css"], function (SVGWidget, Logger, $) {
    'use strict';

    var instance = null;

    var SVG = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }
    };

    SVG.getInstance = function () {
        if (instance === null) {
            instance = new SVG();
        }

        return instance;
    };

    SVG.prototype.srParseSVG = function (svg, error) {
        if (error) {
            Logger.error('[SVG] Failed loading SVG: ' + error);
            svg.text(10, 20, error, {fill: 'red'});
            return;
        }

        /* Make SVG responsive */
        svg.root().setAttribute('width', '100%');
        svg.root().setAttribute('height', '100%');

        $('[id^="snmd_"]', svg.root()).each(function () {
            var json;
            try {
                json = JSON.parse($(this).find("desc").text());
            } catch (err) {
                Logger.error('JSON error in widget instance #' + this.id + ': ' + err.message);
            }
            if (json) {
                SVGWidget.srCreateWidget(svg, this, json);
            }
        });
    };
    
    SVG.prototype.srLoadSVG = function (id, url) {
        Logger.debug('[SVG] Loading #' + id + ': ' + url);
        $('#' + id).svg({loadURL: url + '?nonce=' + Math.random(), 'max-width': '100%', 'max-height': '100%', onLoad: this.srParseSVG});
    };
    
    SVG.prototype.srRelToAbsPos = function (root, svg) {
        var rrect = root.getBoundingClientRect();
        var crect = svg.getBoundingClientRect();
        var ctm = svg.getScreenCTM();

        return {
            x: (ctm.a * crect.left) + (ctm.c * crect.top) + ctm.e + rrect.left,
            y: (ctm.b * crect.left) + (ctm.d * crect.top) + ctm.f + rrect.top
        };
    };

    return SVG.getInstance();
});
