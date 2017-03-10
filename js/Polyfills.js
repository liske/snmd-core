/*
SNMD - Scotty Network Management Dashboard
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
    define,
    require
*/

define(["jquery", "js-logger"], function ($, Logger) {
    'use strict';

    var instance = null;

    var Polyfills = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.snmdPolyfills = {};
        
        /* CSS variables */
        if (window.CSS && window.CSS.supports && window.CSS.supports('(--polyfill-test: red)')) {
            Logger.debug("[Polyfills] CSS variables: supported");
        } else {
            Logger.debug("[Polyfills] CSS variables: not supported");

            require(["css!../css/polyfill-cssvars"], function () {
                $('body').addClass("polyfill-cssvars");
            });
            this.snmdPolyfills.cssVars = 1;
        }
    };

    Polyfills.prototype.snmdUsePolyfill = function (name) {
        return (typeof this.snmdPolyfills[name] !== "undefined");
    };
    
    Polyfills.getInstance = function () {
        if (instance === null) {
            instance = new Polyfills();
        }

        return instance;
    };

    return Polyfills.getInstance();
});
