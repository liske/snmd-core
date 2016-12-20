/*
scotty-rev - Scotty REVOLUTION Network Management Dashboard

Authors:
  Thomas Liske <liske@ibh.de>

Copyright Holder:
  2012 - 2013 (C) Thomas Liske [https://fiasko-nw.net/~thomas/tag/scotty]
  2014 - 2016 (C) IBH IT-Service GmbH [http://www.ibh.de/OSS/Scotty]

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

define(["snmd-core/MQTT", "require"], function (MQTT, require) {
    'use strict';

    var instance = null;

    var SVGWidget = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.Impl = {};
        this.Widgets = {};
    };

    SVGWidget.getInstance = function () {
        if (instance === null) {
            instance = new SVGWidget();
        }

        return instance;
    };

    SVGWidget.prototype.srRegisterImpl = function (name, impl) {
        this.Impl[name] = impl;
    };

    SVGWidget.prototype.srLookupImpl = function (name) {
        return this.Impl[name];
    };
    
    SVGWidget.prototype.srRegisterWidget = function (name, widget) {
        this.Widgets[name] = widget;
    };

    SVGWidget.prototype.srLookupWidget = function (name) {
        return this.Widgets[name];
    };
    
    SVGWidget.prototype.srClassOpts = function (desc, impl) {
        var cls = {
            base: ['snmd-bcl-' + impl],
            state: ['snmd-scl-', 'snmd-scl-' + impl + '-']
        };

        /* add default base class by widget */
        if (typeof desc.type !== "undefined") {
            cls.base.push('snmd-bcl-' + desc.type);
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
    
    SVGWidget.prototype.srCreateWidget = function (root, svg, desc) {
        if (typeof desc.type === "undefined") {
            console.error("Widget " + svg.id + " has no type set!");
            return;
        }

        //console.error(require.toUrl("/blib/snmd-widgets-nagios/src/" + desc.type));
        require(["snmd-widgets-nagios/" + desc.type], function (WClass) {
            try {
                var obj = new WClass(root, svg, desc);
                if (typeof desc.topics !== "undefined") {
                    desc.topics.forEach(function (topic) {
                        MQTT.srRegisterTopic(topic, obj);
                    });
                }
            } catch (err) {
                console.error("Failed to create widget " + svg.id + " of type " + desc.type + ": " + err.message);
                return;
            }
        });
        //            this.Widgets[desc.type] = require("../../snmd-widgets-nagios/blib/src/" + desc.type);
    };

    return SVGWidget.getInstance();
});
