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
    define,
    require
*/

require(["jquery"], function ($) {
    'use strict';

    var div = $("#snmd-loader");
    var i = $("#snmd-loader > i");
    var queue = 0;

    $(document).on({
        ajaxStart: function () {
            if (queue < 1) {
                div.removeClass("off");
            }
            queue += 1;
        },
        ajaxStop: function () {
            queue -= 1;
            if (queue < 1) {
                div.addClass("off");
            }
        }
    });
});

require.config({
    map: {
        '*': {
            'css': 'require-css'
        }
    },
    paths: {
        "moment": "moment/min/moment.min",
        "sprintf": "sprintf/src/sprintf",
        "jquery.svg": "snmd-core/lib/svg-1.5.0/jquery.svg.min",
        "jquery.svggraph": "snmd-core/lib/svg-1.5.0/jquery.svggraph.min",
        "svgpathdata": "snmd-core/lib/svgpathdata-1.0.3/SVGPathData",
        "paho": "snmd-core/lib/paho.javascript-1.0.2/mqttws31-min",
        "require-css": "require-css/css",
        "js-cookie": "js-cookie/src/js.cookie"
    },
    shim: {
        "jquery.svg" : ["jquery"],
        "jquery.svggraph" : ["jquery.svg", "jquery"],
        "paho": {
            exports: "Paho"
        }
    }
});

define([], function () {
    'use strict';

    var Main = function (snmd_conf) {
        require(["snmd-core/Core"], function (Core) {
            Core.snmdInit(snmd_conf);
        });

    };

    return Main;
});
