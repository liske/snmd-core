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

define(["snmd-core/MQTT", "require", "js-logger"], function (MQTT, require, Logger) {
    'use strict';

    var instance = null;

    var SVGWidget = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.widgetPrefixes = {};
        this.ReWidgetName = /^([\w\-]+):([\w\-]+)$/;
    };

    SVGWidget.getInstance = function () {
        if (instance === null) {
            instance = new SVGWidget();
        }

        return instance;
    };

    SVGWidget.prototype.srClassOpts = function (desc, impl) {
        var cls = {
            base: ['snmd-bcl-' + impl],
            state: ['snmd-scl-', 'snmd-scl-' + impl + '-']
        };

        /* add default base class by widget */
        if (typeof desc.type !== "undefined") {
            cls.base.push('snmd-bcl-' + desc.type.replace(':', '_'));
        }

        /* add CSS base classes */
        if (typeof desc.bcls !== "undefined") {
            cls.base.push.apply(cls.base, desc.bcls);
        }

        if (typeof desc.bcl !== "undefined") {
            cls.base.push(desc.bcl);
        }

        /* add CSS classes depending on state */
        if (typeof desc.scls !== "undefined") {
            cls.state.push.apply(cls.state, desc.scls);
        }

        if (typeof desc.scl !== "undefined") {
            cls.state.push(desc.scl);
        }

        return cls;
    };

    SVGWidget.prototype.snmdRegisterPrefix = function (prefix, pkg) {
        this.widgetPrefixes[prefix] = pkg;
    };

    SVGWidget.prototype.srCreateWidget = function (root, svg, desc) {
        if (typeof desc.type === "undefined") {
            Logger.error("[SVGWidget] Widget " + svg.id + " has no type set!");
            return;
        }

        var res = this.ReWidgetName.exec(desc.type);
        if (res) {
            if (typeof this.widgetPrefixes[res[1]] === "undefined") {
                Logger.error("[SVGWidget] Widget package prefix " + res[1] + "/ is unknown!");
                return;
            }

            require([this.widgetPrefixes[res[1]] + "/" + res[2]], function (WClass) {
                try {
                    var obj = new WClass(root, svg, desc);
                    if (typeof desc.topics !== "undefined") {
                        desc.topics.forEach(function (topic) {
                            MQTT.srRegisterTopic(topic, obj);
                        });
                    }
                } catch (err) {
                    Logger.error("[SVGWidget] Failed to create widget " + svg.id + " of type " + desc.type + ": " + err.message);
                    return;
                }
            });
        } else {
            Logger.error("[SVGWidget] Widget " + svg.id + " has a invalid syntax for 'type'!");
        }
    };

    return SVGWidget.getInstance();
});
