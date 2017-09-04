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
    DEBUG,
    define
*/

define([], function () {
    'use strict';

    var instance = null;

    var States = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }
    };

    States.getInstance = function () {
        if (instance === null) {
            instance = new States();
        }

        return instance;
    };

    States.prototype.stateColor = function (state) {
        if (typeof state === "undefined") {
            return "Grey";
        }
            
        if (state === 0) {
            return 'LimeGreen';
        }
        
        if (state === 1) {
            return 'Gold';
        }

        if (state === 2) {
            return 'Crimson';
        }

        return "Orange";
    };

    States.prototype.stateName = function (state) {
        if (typeof state === "undefined") {
            return "UNDEFINED";
        }

        if (state === 0) {
            return 'OK';
        }
        
        if (state === 1) {
            return 'WARNING';
        }

        if (state === 2) {
            return 'CRITICAL';
        }

        return 'UNKNOWN';
    };

    return States.getInstance();
});
