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

define(["snmd-core/GUI", "snmd-core/MQTT", "sprintf", "jquery"], function (GUI, MQTT, sprintf, $) {
    'use strict';

    var instance = null;

    var Core = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.version = '0.1';
        this.si_prefs = ['T', 'G', 'M', 'k', '']; //, 'm', 'µ'
        this.si_facts = [ Math.pow(10, 12), Math.pow(10, 9), Math.pow(10, 6), Math.pow(10, 3), 1]; //, Math.pow(10, -3), Math.pow(10, -6)
        this.genid = 0;
    };

    Core.getInstance = function () {
        if (instance === null) {
            instance = new Core();
        }

        return instance;
    };

    Core.prototype.srVersion = function () {
        return this.version;
    };

    Core.prototype.srURLParam = function (name, defval) {
        var results = new RegExp('[?&]' + name + '=([^&#/]*)([&#/]|$)').exec(window.location.href);
        if (results && results[1]) {
            return decodeURIComponent(results[1]);
        }
    
        return defval;
    };

    Core.prototype.srConfigLoaded = function (json) {
        this.config = json;

        console.debug('Loading ' + this.config.default_view);

        $.ajax({
            'global': false,
            'url': this.config.default_view + '?nonce=' + Math.random(),
            'dataType': 'json',
            'success': (function (json) {
                GUI.srInit(json);

                /* MQTT defaults */
                if (typeof this.config.mqttws_host === "undefined") {
                    this.config.mqttws_host = window.location.hostname;
                }
                if (typeof this.config.mqttws_port === "undefined") {
                    this.config.mqttws_port = 9001;
                }

                MQTT.srInit(this.config.mqttws_host, this.config.mqttws_port);
            }).bind(this),
            'error': (function (jqXHR, textStatus, errorThrown) {
                console.error('Failed to load view list: ' + textStatus + ' - ' + errorThrown);
            }).bind(this)
        });
    };
    
    Core.prototype.srInitLoad = function (configURI, failfn) {
        console.debug('Loading ' + configURI);

        $.ajax({
            'global': false,
            'url': configURI + '?nonce=' + Math.random(),
            'dataType': 'json',
            'success': this.srConfigLoaded.bind(this),
            'error': failfn
        });
    };
    
    Core.prototype.srInit = function () {
        console.info('Initializing Scotty REVOLUTION ' + this.version);

        var configName = this.srURLParam('config', 'default');
        if (configName !== 'default') {
            $('#snmd-title').text(configName);
        } else {
            $('#snmd-title').text(window.location.host);
        }

        this.srInitLoad('configs/' + configName + '.json', (function () {
            this.srInitLoad('configs/default.json', function (jqXHR, textStatus, errorThrown) {
                console.error('Failed to load configuration: ' + textStatus + ' - ' + errorThrown);
            });
        }).bind(this));
    };

    Core.prototype.srSiFormatNum = function (value, unit, defstr, fracts) {
        if (typeof value === "undefined") { return defstr; }
        if (isNaN(value)) { return defstr; }

        var neg = 0;
        if (value < 0) {
            value = value * -1;
            neg = 1;
        }

        var i,
            j = 4;
        for (i = 0; i < this.si_facts.length; i++) {
            if (value >= this.si_facts[i] * 0.99) {
                j = i;
                break;
            }
        }

        value = value / this.si_facts[j];
        if (typeof fracts === "undefined" || isNaN(fracts)) {
            if (value < 20) {
                fracts = 1;
            } else {
                fracts = 0;
            }
        }
        if (neg) {
            value = value * -1;
        }

        return sprintf.sprintf("%." + fracts + "f%s%s", value, this.si_prefs[j], unit);
    };
    
    Core.prototype.srNagStateColor = function (state) {
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
    
    Core.prototype.srGenID = function (prefix) {
        this.genid += 1;
        return 'snmd-genid-' + prefix + '-' + this.genid;
    };

    return Core.getInstance();
});
