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
    DEBUG,
    define
*/

define(["snmd-core/Core", "snmd-core/HTML", "snmd-core/SVG", "require", "jquery", "sprintf", "js-cookie", "js-logger"], function (Core, HTML, SVG, require, $, sprintf, cookie, Logger) {
    'use strict';

    var instance = null;

    var GUI = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.idCounter = 0;
        this.TO_SCREEN = 600000;
        this.TO_SWITCH = 30000;
        this.screenState = 0;
        this.viewStates = {};
        this.viewFinalStates = {};
        this.currentStep = 0;
        this.views = {};
        this.views2id = {};
        this.enabledScreenTO = true;
        this.enableRotation = false;

        this.ctrlButtons = {
            '3d': {
                title: "Toggle 3D view.",
                state: 0,
                states: [
                    {
                        facls: "low-vision",
                        cb: function () {
                            this.snmdInit3D(false);
                        }
                    },
                    {
                        facls: "eye",
                        cb: function () {
                            this.snmdInit3D(true);
                        }
                    }
                ]
            },
/*            'volume': {
                title: "Toggle alert sounds.",
                state: 0,
                states: [
                    {
                        facls: "volume-off"
                    },
                    {
                        facls: "volume-up"
                    }
                ]
            },*/
            'rotate': {
                title: "Toggle interval or continuous rotation.",
                state: 0,
                states: [
                    {
                        facls: "repeat",
                        cb: function () {
                            this.enabledScreenTO = true;
                            this.enableRotation = false;
                        }
                    },
                    {
                        facls: "circle-o-notch",
                        cb: function () {
                            this.enabledScreenTO = false;
                            this.enableRotation = false;
                        }
                    },
                    {
                        facls: "refresh",
                        cb: function () {
                            this.enabledScreenTO = false;
                            this.enableRotation = true;
                            this.srScreenTimeOut();
                        }
                    }
                ]
            }/*,
            'follow': {
                title: "Toggle current view follows state changes.",
                state: 0,
                states: [
                    {
                        facls: "crosshairs"
                    },
                    {
                        facls: "stop-circle-o"
                    }
                ]
            }*/
        };
    };

    GUI.getInstance = function () {
        if (instance === null) {
            instance = new GUI();
        }

        return instance;
    };

    GUI.prototype.srScreenTimeOut = function () {
        var that = require('snmd-core/GUI');

        /* Ignore timeout if screensaver is disabled */
        if (!that.enabledScreenTO) {
            that.screenTimeOut = window.setTimeout(that.srScreenTimeOut, that.TO_SWITCH);
            return;
        }

        if (that.screenState === 0) {
            that.screenState += 1;
            $(document.body).addClass('on-screensaver');
        }

        $('.srViews').each(function () {
            var a = $(this).children('.srViewsNav').find('a');
            var cur = 0;
            var i;
            for (i = 0; i < a.length; i++) {
                if (a[i].hash === that.currentView) {
                    cur = i;
                }
            }

            cur += 1;
            if (cur >= a.length) {
                cur = 0;
            }

            a[cur].click();
        });

        that.screenTimeOut = window.setTimeout(that.srScreenTimeOut, that.TO_SWITCH);
    };
    
    GUI.prototype.srStateChanged = function (root, svg, state) {
        this.viewStates[root][svg] = state;

        if (this.viewFinalStates[root] < state) {
            this.viewFinalStates[root] = state;
            $('#switch-' + root).css('color', require("snmd-core/Core").srNagStateColor(this.viewFinalStates[root]));
        } else {
            if (this.viewFinalStates[root] > state) {
                var fs = state;
                var that = this;
                Object.keys(this.viewStates[root]).forEach(function (k) {
                    if (that.viewStates[root][k] > fs) {
                        fs = that.viewStates[root][k];
                    }
                });
                this.viewFinalStates[root] = fs;
                $('#switch-' + root).css('color', require("snmd-core/Core").srNagStateColor(this.viewFinalStates[root]));
            }
            
        }
    };

    GUI.prototype.snmdInit3D = function (is_3d) {
        if (typeof is_3d === "undefined") {
            is_3d = $(document.body).hasClass('snmd-in-3d');
        }

        if (is_3d) {
            $(document.body).addClass('snmd-in-3d').removeClass('snmd-in-2d');

            var dps = 360 / Object.keys(this.views).length;
            var r = (Object.keys(this.views).length > 1 ? (1906 / 2) / Math.tan(Math.PI / Object.keys(this.views).length) : 0);
            var step = 0;

            Object.keys(this.views).forEach(function (k) {
                $('#' + this.views2id[k]).css(
                    'transform',
                    'rotateY(' + (dps * step) + 'deg) translateZ(' + r + 'px)'
                );

                step += 1;
            }, this);

            this.snmdAlignView(r, -dps * this.currenStep);
        } else {
            $(document.body).addClass('snmd-in-2d').removeClass('snmd-in-3d');

            Object.keys(this.views).forEach(function (k) {
                $('#' + this.views2id[k]).css(
                    'transform',
                    ''
                );
            }, this);
        }
    };

    GUI.prototype.snmdAlignView = function (r, a) {
        if ($(document.body).hasClass('snmd-in-3d')) {
            $('#snmd-views').css(
                'transform',
                'translateZ(-' + r  + 'px) rotateY(' + a + 'deg)'
            );
        }
    };

    GUI.prototype.srInit = function (views) {
        this.views = views;
        var that = this;

        if (typeof HTML === "undefined") {
            HTML = require('snmd-core/HTML');
        }
        if (typeof SVG === "undefined") {
            SVG = require('snmd-core/SVG');
        }

        $('.srViews').each(function () {
            var nav = $(this).children('.srViewsNav');
            Object.keys(views).forEach(function (k) {
                this.views2id[k] = 'srView-' + (this.idCounter += 1).toString(16);
                this.viewStates[this.views2id[k]] = {};
                this.viewFinalStates[this.views2id[k]] = -1;
                nav.append('<li><a id="switch-' + this.views2id[k] + '" href="#' + this.views2id[k] + '"><span>' + this.views[k].title + "</span></a></li>");
            }, that);

            var div = $('#snmd-views');
            var dps = 360 / Object.keys(views).length;
            var step = 0;
            var r = (Object.keys(views).length > 1 ? (1906 / 2) / Math.tan(Math.PI / Object.keys(views).length) : 0);

            Object.keys(views).forEach(function (k, idx, ary) {
                div.append('<div class="svgview" id="' + that.views2id[k] + '"></div>');

                switch (views[k].render) {
                case 'html':
                    HTML.srLoadHTML(that.views2id[k], that.views[k].url, that.views[k].reload);
                    break;

//              case 'svg':
                default:
                    SVG.srLoadSVG(that.views2id[k], that.views[k].url);
                    break;
                }

                step += 1;
            });
            that.snmdInit3D();

            nav.find('a').click(function () {
                Logger.debug('[GUI] Viewing '  + this.hash);
                that.currentView = this.hash;

                div.children().removeClass('current').filter(this.hash).removeClass('next').removeClass('prev').addClass('current');
                $(that.currentView).prevAll().removeClass('next').addClass('prev');
                $(that.currentView).nextAll().removeClass('prev').addClass('next');

                nav.find('a').removeClass('selected').filter(this).addClass('selected');

                that.currenStep = $(that.currentView).prevAll().length;
                that.snmdAlignView(r, -dps * that.currenStep);
                
                return false;
            }).filter(':first').click();

            var transTO;
            $('#snmd-views').on('transitionend', function () {
                if (typeof transTO !== "undefined") {
                    window.clearTimeout(transTO);
                    transTO = undefined;
                }

                if (that.enableRotation) {
                    transTO = window.setTimeout(function () {
                        $('.srViews').each(function () {
                            var a = $(this).children('.srViewsNav').find('a');
                            var cur = 0;
                            var i;
                            for (i = 0; i < a.length; i++) {
                                if (a[i].hash === that.currentView) {
                                    cur = i;
                                }
                            }

                            cur += 1;
                            if (cur >= a.length) {
                                cur = 0;
                            }

                            a[cur].click();
                        });
                    }, 5000);
                }
            });

            if (window.location.hash !== "undefined") {
                var nth = parseInt(window.location.hash.replace(/^#srView-/, ""), 10) - 1;
                nav.find('a:eq(' + nth + ')').click();
            }

            var ctrl = $('ul.snmd-ctrl').empty();
            Object.keys(that.ctrlButtons).forEach(function (el) {
                var c = that.ctrlButtons[el];
                var icon = $('<i></i>').addClass("fa fa-" + c.states[c.state].facls);
                var button = $('<a></a>').attr({
                    title: c.title,
                    href: "#" + el
                }).append(
                    icon
                ).click(function () {
                    icon.removeClass("fa-" + c.states[c.state].facls);
                    c.state = (c.state + 1) % c.states.length;
                    icon.addClass("fa-" + c.states[c.state].facls);

                    c.states[c.state].cb.call(that);

                    // Save setting to cookie
                    cookie.set('snmd-ctrl-' + el, c.state);

                    return false;
                });

                /* Restore setting from cookie */
                var co = cookie.get('snmd-ctrl-' + el);
                if (typeof co !== "undefined") {
                    icon.removeClass("fa-" + c.states[c.state].facls);
                    c.state = parseInt(co, 10) % c.states.length;
                    icon.addClass("fa-" + c.states[c.state].facls);

                    c.states[c.state].cb.call(that);
                }

                ctrl.append(
                    $('<li></li>').append(
                        button
                    )
                );
            });
        }, this);

        // Update time of day
        var el_clock = $('div#snmd_clock');
        if (el_clock) {
            window.setInterval(function () {
                var now = new Date();
                var zoff = -now.getTimezoneOffset();
                var sign = (zoff >= 0 ? '+' : '-');
                zoff = Math.abs(zoff);

                var str = sprintf.sprintf("%d-%02d-%02dT%02d:%02d:%02d%s%02d%02d",
                                  now.getFullYear(),
                                  now.getMonth() + 1,
                                  now.getDay(),
                                  now.getHours(),
                                  now.getMinutes(),
                                  now.getSeconds(),
                                  sign,
                                  zoff / 60,
                                  zoff % 60);

                el_clock.text(str);
            }, 1000);
        }

        // Screensaver
        this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);

        // Handle mouse moves (reset screen saver timeout)
        $(document).mousemove((function () {
            if (this.enableRotation) {
                return;
            }

            this.screenState = 0;

            if (typeof this.screenTimeOut !== "undefined") {
                window.clearTimeout(this.screenTimeOut);
                this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);
                $(document.body).removeClass('on-screensaver');
            }
        }).bind(this));

        // Handle key press (reset screen saver time, handle shortcuts)
        $(document).keypress((function (ev) {
            this.screenState = 0;

            if (typeof this.screenTimeOut !== "undefined") {
                window.clearTimeout(this.screenTimeOut);
                this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);
            }

            // Select view by numpad
            if (ev.which > 47 && ev.which < 58) {
                var key = (ev.which === 48 ? '10' : String.fromCharCode(ev.which));

                $('a[href="#srView-' + key + '"]').click();
            }
        }).bind(this));
    };

    return GUI.getInstance();
});
