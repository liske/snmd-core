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

define(["jquery", "js-logger"], function ($, Logger) {
    'use strict';

    var instance = null;

    var HTML = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }
    };

    HTML.getInstance = function () {
        if (instance === null) {
            instance = new HTML();
        }

        return instance;
    };

    HTML.prototype.srLoadHTML = function (id, url, reload) {
        Logger.debug('Loading #' + id + ': ' + url);

        var iframe = $('<iframe>', {
            src: url,
            width: '95%',
            height: '95%',
            scrolling: 'no'
        }).addClass('htmlview').appendTo($('#' + id));

        if (typeof reload !== "undefined") {
            window.setInterval(function () {
                iframe[0].contentWindow.location.reload(false);
            }, reload * 1000);
        }
    };

    return HTML.getInstance();
});
