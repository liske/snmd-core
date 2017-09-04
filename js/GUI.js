/*
SNMD - Simple Network Monitoring Dashboard
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
    document,
    window
*/

define(["snmd-core/js/Core", "snmd-core/js/HTML", "snmd-core/js/Notify", "snmd-core/js/Sound", "snmd-core/js/SVG", "snmd-core/js/Polyfills", "require", "jquery", "sprintf", "js-cookie", "js-logger", "qtip2", "css!qtip2"], function (Core, HTML, Notify, Sound, SVG, Polyfills, require, $, sprintf, cookie, Logger) {
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
        this.navbarState = 0;
        this.currentStep = 0;
        this.currentRotations = 0;
        this.resizeTO = undefined;
        this.viewConf = {
            views: NaN,
            dps: NaN,
            r: NaN,
            is_3d: false
        };
        this.views = {};
        this.views2id = {};
        this.enabledScreenTO = true;
        this.enableRotation = false;
        this.enableFollow = true;

        this.ctrlButtons = {
            '3d': {
                shortcut: "d".charCodeAt(),
                title: "Toggle 3D view.",
                state: 0,
                states: [
                    {
                        facls: "low-vision",
                        descr: "Disable 3D view (increases performance).",
                        cb: function () {
                            this.snmdInit3D(false);
                        }
                    },
                    {
                        facls: "eye",
                        descr: "Enable 3D view (decreased performance).",
                        cb: function () {
                            this.snmdInit3D(true);
                        }
                    }
                ]
            },
            'solarized': {
                shortcut: "s".charCodeAt(),
                title: "Switch solarized theme.",
                state: 0,
                states: [
                    {
                        facls: "moon-o",
                        descr: "Switch theme to solarized dark.",
                        cb: function () {
                            this.snmdSolarizedDark();
                        }
                    },
                    {
                        facls: "sun-o",
                        descr: "Switch theme to solarized light.",
                        cb: function () {
                            this.snmdSolarizedLight();
                        }
                    }
                ]
            },
            'volume': {
                shortcut: "v".charCodeAt(),
                title: "Toggle alert sounds.",
                state: 0,
                states: [
                    {
                        facls: "volume-up",
                        descr: "Enable notification sounds.",
                        cb: function () {
                            Sound.snmdUnmute();
                        }
                    },
                    {
                        facls: "volume-off",
                        descr: "Disable notification sounds.",
                        cb: function () {
                            Sound.snmdMute();
                        }
                    }
                ]
            },
            'notify': {
                shortcut: "n".charCodeAt(),
                title: "Toggle browser notifications.",
                state: 0,
                states: [
                    {
                        facls: "commenting",
                        descr: "Enable desktop notifications.",
                        cb: function () {
                            Notify.enable();
                        }
                    },
                    {
                        facls: "comment-o",
                        descr: "Disable desktop notifications.",
                        cb: function () {
                            Notify.disable();
                        }
                    }
                ]
            },
            'rotate': {
                shortcut: "r".charCodeAt(),
                title: "Toggle interval or continuous view rotation.",
                state: 0,
                states: [
                    {
                        facls: "repeat",
                        descr: "Rotate view after activity timeout.",
                        cb: function () {
                            this.enabledScreenTO = true;
                            this.enableRotation = false;
                        }
                    },
                    {
                        facls: "circle-o-notch",
                        descr: "Keep current view.",
                        cb: function () {
                            this.enabledScreenTO = false;
                            this.enableRotation = false;
                        }
                    },
                    {
                        facls: "refresh",
                        descr: "Continuous view rotation.",
                        cb: function () {
                            this.enabledScreenTO = false;
                            this.enableRotation = true;
                            this.snmdNavRel(1);
                        }
                    }
                ]
            },
            'follow': {
                shortcut: "f".charCodeAt(),
                title: "Toggle current view follows state changes.",
                state: 0,
                states: [
                    {
                        facls: "crosshairs",
                        descr: "Switch to views if there state changes at least warning.",
                        cb: function () {
                            this.enableFollow = true;
                        }
                    },
                    {
                        facls: "stop-circle-o",
                        descr: "Do not switch to views due to state changes.",
                        cb: function () {
                            this.enableFollow = false;
                        }
                    }
                ]
            }
        };

        if (Polyfills.snmdUsePolyfill('cssVars')) {
            delete this.ctrlButtons.solarized;
        }
    };

    GUI.getInstance = function () {
        if (instance === null) {
            instance = new GUI();
        }

        return instance;
    };

    GUI.prototype.srScreenTimeOut = function () {
        var that = require('snmd-core/js/GUI');

        /* Ignore timeout if screensaver is disabled */
        if (!that.enabledScreenTO) {
            that.screenTimeOut = window.setTimeout(that.srScreenTimeOut, that.TO_SWITCH);
            return;
        }

        if (that.screenState === 0) {
            that.screenState += 1;
            $(document.body).addClass('on-screensaver');
        }

        $('#snmd-nav').each(function () {
            var a = $(this).children('.srViewsNav').find('a');

            that.currentStep += 1;
            that.currentRotations += 1;
            a[that.currentStep % a.length].click();
        });

        that.screenTimeOut = window.setTimeout(that.srScreenTimeOut, that.TO_SWITCH);
    };

    GUI.prototype.snmdStateUpdate = function (root, svg, lastState, finalState) {
        if (lastState !== finalState) {
            $('#switch-' + root).addClass('snmd-scl-' + finalState).removeClass('snmd-scl-' + lastState);
            $('#' + root).addClass('snmd-scl-' + finalState).removeClass('snmd-scl-' + lastState);

            if (finalState > 0 && this.enableFollow) {
                /* Disable screen saver. */
                this.screenState = 0;

                if (typeof this.screenTimeOut !== "undefined") {
                    window.clearTimeout(this.screenTimeOut);
                    this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);
                }

                /* Switch to changed view. */
                $('#switch-' + root).click();
            }

            /* Don't play OK sound if the previous state was unset (due to SNMD init) */
            if ($.inArray(lastState, [-1, 3]) === -1 || finalState > 0) {
                Sound.snmdPlay('default', 'state-' + finalState);
            }

            if (this.navbarState !== finalState) {
                var lastNavbarState = this.navbarState;
                var fs = finalState;
                var that = this;
                Object.keys(this.viewFinalStates).forEach(function (k) {
                    if (that.viewFinalStates[k] > fs) {
                        fs = that.viewFinalStates[k];
                    }
                });

                if (fs !== lastNavbarState) {
                    $('#snmd-nav').addClass('snmd-scl-' + fs).removeClass('snmd-scl-' + lastNavbarState);
                    this.navbarState = fs;
                }
            }
        }
    };

    GUI.prototype.srStateChanged = function (root, svg, state) {
        this.viewStates[root][svg] = state;

        Notify.notify(svg + " is now " + state);

        var lastState = this.viewFinalStates[root];
        if (this.viewFinalStates[root] < state) {
            this.viewFinalStates[root] = state;
            this.snmdStateUpdate(root, svg, lastState, this.viewFinalStates[root]);
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
                this.snmdStateUpdate(root, svg, lastState, this.viewFinalStates[root]);
            }

        }
    };

    GUI.prototype.snmdInit3D = function (is_3d) {
        if (typeof is_3d === "undefined") {
            is_3d = $(document.body).hasClass('snmd-in-3d');
        }

        if (is_3d) {
            this.viewConf.is_3d = true;
            $(document.body).addClass('snmd-in-3d').removeClass('snmd-in-2d');

            this.resizeHandler();
        } else {
            this.viewConf.is_3d = false;
            $(document.body).addClass('snmd-in-2d').removeClass('snmd-in-3d');

            Object.keys(this.views).forEach(function (k) {
                $('#' + this.views2id[k]).css(
                    'transform',
                    ''
                );
            }, this);
            $('#snmd-views').css('transform', '');
        }
    };

    GUI.prototype.snmdSolarizedDark = function () {
        $(document.body).addClass('solarized-dark').removeClass('solarized-light');
    };

    GUI.prototype.snmdSolarizedLight = function () {
        $(document.body).addClass('solarized-light').removeClass('solarized-dark');
    };

    GUI.prototype.snmdAlignView = function () {
        if (this.viewConf.is_3d) {
            $('#snmd-views').css(
                'transform',
                'translateZ(-' + this.viewConf.r + 'px) rotateY(' + (this.currentRotations * -this.viewConf.dps) + 'deg)'
            );
        }
    };

    GUI.prototype.snmdNavRel = function (offset) {
        var a = $('#snmd-nav').children('.srViewsNav').find('a');

        this.currentRotations = (this.currentRotations + offset) % 2147483648;
        this.currentStep += offset;
        while (this.currentStep < 0) {
            this.currentStep += a.length;
        }
        this.currentStep = this.currentStep % a.length;
        this.changeView(this.currentStep);
    };

    /*
     * In 3D mode we need to recalculate the distance of the views from the origin.
     */
    GUI.prototype.resizeHandler = function () {
        if (this.viewConf.is_3d) {
            this.viewConf.vw = $("#snmd-vouter").width();
            this.viewConf.r = (this.numViews > 1 ? (this.viewConf.vw / 2) / Math.tan(Math.PI / this.numViews) : 0);

            var step = 0;
            Object.keys(this.views).forEach(function (k) {
                $('#' + this.views2id[k]).css(
                    'transform',
                    'rotateY(' + (this.viewConf.dps * step) + 'deg) translateZ(' + this.viewConf.r + 'px)'
                );

                step += 1;
            }, this);

            this.snmdAlignView();
        }
    };

    /*
     * Run resizeHandler() after 200ms of no ongoing resize to reduze CPU load while resizing (Chrome).
     */
    GUI.prototype.resizeHandlerThrottle = function () {
        if (this.viewConf.is_3d) {
            if (this.resizeTO) {
                clearTimeout(this.resizeTO);
            }
            this.resizeTO = setTimeout(this.resizeHandler.bind(this), 200);
        }
    };

    /*
     * Set control button state to a explicit value.
     */
    GUI.prototype.setCtrlState = function (name, state) {
        var c = this.ctrlButtons[name];

        c.icon.removeClass("fa-" + c.states[c.state].facls);
        c.state = parseInt(state, 10) % c.states.length;
        c.icon.addClass("fa-" + c.states[c.state].facls);
        c.states[c.state].cb.call(this);
    };

    GUI.prototype.setRotateTimeout = function () {
        if (typeof this.transTO !== "undefined") {
            window.clearTimeout(this.transTO);
            this.transTO = undefined;
        }

        if (this.enableRotation) {
            this.transTO = window.setTimeout(function (that) {
                that.snmdNavRel(1);
            }, 5000, this);
        }
    };

    GUI.prototype.changeView = function (idx) {
        Logger.debug('[GUI] Viewing #' + this.views2id[idx]);

        var div = $('#snmd-views');
        var nav = $('#snmd-nav').children('.srViewsNav');
        var view = div
            .children()
            .removeClass('current')
            .filter("#" + this.views2id[idx]);

        view
            .removeClass('next')
            .removeClass('prev')
            .addClass('current');

        view
            .prevAll()
            .removeClass('next')
            .addClass('prev');

        view
            .nextAll()
            .removeClass('prev')
            .addClass('next');

        nav
            .find('a')
            .removeClass('selected')
            .filter("#switch-" + this.views2id[idx])
            .addClass('selected');

        if (!this.viewConf.is_3d) {
            this.setRotateTimeout();
        }

        this.snmdAlignView();
        window.location.hash = '#' + (this.currentStep + 1);
    };

    GUI.prototype.srInit = function (views) {
        this.views = views;
        this.numViews = views.length;

        this.viewConf.dps = 360 / this.numViews;
        $(window).on('resize', this.resizeHandlerThrottle.bind(this));
        this.resizeHandler();

        var that = this;
        var navbar = $('#snmd-nav');
        var nav = navbar.children('.srViewsNav');
        var k;
        var fNavClick = function (ev) {
                that.currentRotations += ev.data - that.currentStep;
                that.currentStep = ev.data;
                that.changeView(ev.data);
            };
        for (k = 0; k < views.length; k++) {
            this.views2id[k] = 'srView-' + (k + 1);
            this.viewStates[this.views2id[k]] = {};
            this.viewFinalStates[this.views2id[k]] = -1;

            var qtitle = $('<span></span>').text(
                'Switch to view "' + this.views[k].title + '".'
            );
            var btn = $('<a id="switch-' + this.views2id[k] + '" href="#' + (k + 1) + '" class="snmd-nav-switch"></a>').text(this.views[k].title).click(k, fNavClick);

            $('<li></li>').qtip({
                content: {
                    text: (parseInt(k, 10) > 9 ? qtitle : $('<div></div>').append($('<div class="snmd-nav-key"></div>').text((parseInt(k, 10) + 1) % 10)).append(qtitle))
                }
            }).append(btn).appendTo(nav);
        }

        var div = $('#snmd-views');
        var step = 0;
        for (k = 0; k < views.length; k++) {
            div.append('<div class="svgview" id="' + that.views2id[k] + '"></div>');

            switch (views[k].render) {
            case 'html':
                HTML.srLoadHTML(that.views2id[k], that.views[k].url, that.views[k].reload);
                break;

            default:
                SVG.srLoadSVG(that.views2id[k], that.views[k].url);
                break;
            }

            step += 1;
        }
        that.snmdInit3D();

        div.on('transitionend', this.setRotateTimeout.bind(that));

        if (window.location.hash !== "") {
            var nth = parseInt(window.location.hash.replace(/^#/, ""), 10) - 1;
            var a = nav.find('a:eq(' + (nth % views.length) + ')');
            if (a.length === 0) {
                nav.find('a').filter(':first').click();
            } else {
                a.click();
            }
        } else {
            nav.find('a').filter(':first').click();
        }

        var ctrl = $('ul.snmd-ctrl').empty();
        Object.keys(that.ctrlButtons).forEach(function (el) {
            var c = that.ctrlButtons[el];
            var icon = $('<i></i>').addClass("fa fa-" + c.states[c.state].facls);

            var qtip = $("<span></span>").append($('<div class="snmd-nav-key"></div>').text(String.fromCharCode(c.shortcut))).append($('<span></span>').text(c.title));
            var ul = $("<ul class='snmd-nav-icolist'></ul>");
            c.states.forEach(function (el) {
                var ico = $("<i></i>").addClass("fa fa-" + el.facls);
                var descr = $("<span></span>").text(el.descr);

                ul.append(
                    $("<li></li>").append(ico).append(descr)
                );
            });

            var button = $('<a></a>').attr({
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
            }).qtip({
                content: {
                    title: qtip,
                    text: ul
                }
            });
            that.ctrlButtons[el].icon = icon;
            that.ctrlButtons[el].button = button;

            /* Restore setting from cookie */
            var co = cookie.get('snmd-ctrl-' + el);
            if (typeof co !== "undefined") {
                that.setCtrlState(el, co);
            }

            ctrl.append(
                $('<li></li>').append(
                    button
                )
            );
        });

        /* Check if Desktop Notifications are available. */
        Notify.checkPerm(null, function () {
            that.setCtrlState('notify', 1);
            that.ctrlButtons.notify.states.shift();
            that.ctrlButtons.notify.state = 0;
        });

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
                                  now.getDate(),
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
        $(document).mousemove(function () {
            if (this.enableRotation) {
                return;
            }

            this.screenState = 0;

            if (typeof this.screenTimeOut !== "undefined") {
                window.clearTimeout(this.screenTimeOut);
                this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);
                $(document.body).removeClass('on-screensaver');
            }
        }.bind(this));

        // Handle key press (reset screen saver time, handle shortcuts)
        $(document).keydown(function (ev) {
            this.screenState = 0;

            if (typeof this.screenTimeOut !== "undefined") {
                window.clearTimeout(this.screenTimeOut);
                this.screenTimeOut = window.setTimeout(this.srScreenTimeOut, this.TO_SCREEN);
            }

            if (ev.keyCode === 37 || ev.keyCode === 39) {
                this.snmdNavRel(ev.keyCode === 37 ? -1 : +1);
            } else if (ev.keyCode === 38 || ev.keyCode === 40) {
                var links = $('#snmd-nav').children('.srViewsNav').find('a');
                links[(ev.keyCode === 40 ? 0 : links.length - 1)].click();
            }

        }.bind(this));

        // Handle key press (reset screen saver time, handle shortcuts)
        $(document).keypress(function (ev) {
            // Select view by numpad
            if (ev.which > 47 && ev.which < 58) {
                var key = (ev.which === 48 ? 'a' : String.fromCharCode(ev.which));

                $('#switch-srView-' + key).click();

                ev.preventDefault();
                return;
            }

            Object.keys(that.ctrlButtons).forEach(function (el) {
                var btn = that.ctrlButtons[el];
                if (btn.shortcut === ev.which) {
                    that.ctrlButtons[el].button.click();

                    ev.preventDefault();
                    return;
                }
            });
        }.bind(this));

        $(document).on('swipeleft', function () {
            this.snmdNavRel(1);
        }.bind(this));

        $(document).on('swiperight', function () {
            this.snmdNavRel(-1);
        }.bind(this));
    };

    
    return GUI.getInstance();
});
