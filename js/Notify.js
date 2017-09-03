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

define(["snmd-core/js/States", "push", "jquery", "js-logger"], function (States, Push, $, Logger) {
    'use strict';

    var instance = null;

    var Notify = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.disabled = false;
        this.notifications = {};
    };

    Notify.getInstance = function () {
        if (instance === null) {
            instance = new Notify();
        }

        return instance;
    };

    Notify.prototype.checkPerm = function (onGranted, onDenied) {
        Push.Permission.request(onGranted, onDenied);
    };

    Notify.prototype.notify = function (prefix, topic, state, title, msg) {
        if (typeof this.notifications[prefix] === "undefined") {
            this.notifications[prefix] = {};
        }

        if (typeof this.notifications[prefix][topic] === "undefined") {
            if (state === 0) {
                this.notifications[prefix][topic] = state;
                return;
            }

            this.notifications[prefix][topic] = undefined;
        }

        if (this.notifications[prefix][topic] === state) {
            return;
        }

        this.notifications[prefix][topic] = state;

        if (this.disabled) {
            return;
        }
    
        try {
            var stateName = States.stateName(state);

            Push.create(title + ": " + stateName, {
                body: msg,
                icon: 'img/notify/' + stateName + '.png',
                tag: prefix + '_' + topic,
                timeout: 10000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        } catch (err) {
            Logger.error("[Notify] Exception for " + prefix + "#" + topic + ": " + err.message);
        }
    };

    Notify.prototype.enable = function () {
        this.disabled = false;

        Logger.info("[Notify] Browser notifications enabled.");
    };

    Notify.prototype.disable = function () {
        this.disabled = true;

        Logger.info("[Notify] Browser notifications disabled.");
    };


    return Notify.getInstance();
});
