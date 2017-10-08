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
    define,
    require
*/

define(["snmd-core/js/Polyfills", "snmd-core/js/GUI", "snmd-core/js/MQTT", "snmd-core/js/SVGWidget", "snmd-core/js/Sound", "sprintf", "jquery", "js-logger", "JSON.minify"], function (Polyfills, GUI, MQTT, SVGWidget, Sound, sprintf, $, Logger, JSON) {
    'use strict';

    var instance = null;
    var titleLabel = $('#snmd-title-label');

    var Core = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.version = '0.4.3';
        this.si_prefs = ['T', 'G', 'M', 'k', '']; //, 'm', 'µ'
        this.si_facts = [ Math.pow(10, 12), Math.pow(10, 9), Math.pow(10, 6), Math.pow(10, 3), 1]; //, Math.pow(10, -3), Math.pow(10, -6)
        this.genid = 0;

        this.loadDiv = $("#snmd-load-div");
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

        if (this.config.view.title) {
            titleLabel.text(this.config.view.title);
        } else {
            titleLabel.text(window.location.host);
        }
        
        /* Establish MQTT connection */
        if (typeof this.config.mqttws_uri === "undefined") {
            this.config.mqttws_uri = "ws://" + window.location.hostname + ":9001/";
        }
        MQTT.srInit(this.config.mqttws_uri);

        var vlinks = $("#snmd-title div.snmd-dd-list");
        if ($.isArray(this.config.vlinks) && this.config.vlinks.length > 0) {
            titleLabel.append($("<sup></sup>").text(this.config.vlinks.length));
            var maxlen = 0;
            this.config.vlinks.forEach(function (el) {
                var label = (el.title || el.name);
                maxlen = (maxlen > label.length ? maxlen : label.length);
                $("<a></a>").attr({href: '?config=' + el.name}).text(label).appendTo(vlinks);
            });
            vlinks.css("min-width", (maxlen + 2) + "em");
        } else {
            vlinks.remove();
        }

        Logger.debug('[Core] Loading view "' + this.config.view.json + '"');
        $.ajax({
            'global': false,
            'url': this.config.view.json + '?nonce=' + Math.random(),
            'dataType': 'json',
            'dataFilter': function (data, type) {
                return JSON.minify(data);
            },
            'success': function (json) {
                GUI.srInit(json);
            }.bind(this),
            'error': function (jqXHR, textStatus, errorThrown) {
                Logger.error('[Core] Failed to load view list: ' + textStatus + ' - ' + errorThrown);
            }.bind(this)
        });
    };
    
    Core.prototype.srInitLoad = function (configURI, failfn) {
        Logger.debug('[Core] Loading view config: ' + configURI);

        $.ajax({
            'global': false,
            'url': configURI + '?nonce=' + Math.random(),
            'dataType': 'json',
            'dataFilter': function (data, type) {
                return JSON.minify(data);
            },
            'success': this.srConfigLoaded.bind(this),
            'error': failfn
        });
    };
    
    Core.prototype.snmdInit = function (snmd_conf) {
        Logger.info('[Core] snmd v' + this.version + ' - Simple Network Management Dashboard');

        // Load widget packages from snmd config
        if (typeof snmd_conf.snmd_widgets === "object") {
            // Call initialization function of loaded widget packages
            var fn = function (Boot) {
                Logger.info('[Core]  ' + this.prefix + " => " + this['package'] + ' v' + Boot.getVersion());
                Boot.init(this.prefix, this['package']);
            };

            snmd_conf.snmd_widgets.forEach(function (lib) {
                /* Build include search path */
                var req_cfg = {
                    paths: {}
                };
                req_cfg.paths[lib['package']] = lib['package'] + (snmd_conf.snmd_devel === true ? '' : '/dist');
                require.config(req_cfg);

                /* Bootstrap widget library */
                require([lib['package'] + "/js/Boot"], fn.bind(lib));
                SVGWidget.snmdRegisterPrefix(lib.prefix, lib['package']);
            }, this);
        }

        /* Load default sound set */
        Sound.snmdLoadSet('default');

        this.srInitLoad('configs/' + this.srURLParam('config', 'default') + '.json', function () {
            this.srInitLoad('configs/default.json', function (jqXHR, textStatus, errorThrown) {
                Logger.error('[Core] Failed to load configuration: ' + textStatus + ' - ' + errorThrown);
            });
        }.bind(this));
    };

    Core.prototype.snmdFinishLoading = function (subject) {
        if (typeof this.loadDiv !== "undefined") {
            var loadDiv = this.loadDiv;
            this.loadDiv = undefined;

            loadDiv.fadeOut(3000);
            window.setTimeout(function () {
                loadDiv.remove();
            }, 3000);
        }
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
            if (value < 10 && this.si_facts[j] > 1) {
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
            return "var(--SNMD_undefined)";
        }
            
        if (state === 0) {
            return 'var(--SNMD_ok)';
        }
        
        if (state === 1) {
            return 'var(--SNMD_warning)';
        }

        if (state === 2) {
            return 'var(--SNMD_critical)';
        }

        return "var(--SNMD_unknown)";
    };

    Core.prototype.srGenID = function (prefix) {
        this.genid += 1;
        return 'snmd-genid-' + prefix + '-' + this.genid;
    };

    return Core.getInstance();
});
