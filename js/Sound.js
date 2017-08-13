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
    DEBUG,
    define
*/

define(["snmd-core/js/Core", "howler", "jquery", "js-logger"], function (Core, Howler, $, Logger) {
    'use strict';

    var instance = null;

    var Sound = function () {
        if (instance !== null) {
            throw new Error("Cannot instantiate more than one instance, use getInstance()!");
        }

        this.snmdSoundSets = {};
        this.snmdMuted = false;
    };

    Sound.getInstance = function () {
        if (instance === null) {
            instance = new Sound();
        }

        return instance;
    };

    Sound.prototype.snmdLoadSetJSON = function (setName, json) {
        if (typeof json.sounds !== "undefined") {
            this.snmdSoundSets[setName] = {};

            var that = this;
            $.each(json.sounds, function (soundName, soundFiles) {
                Logger.info('[Sound]  %s => %s', soundName, soundFiles.toString());
                that.snmdSoundSets[setName][soundName] = new Howler.Howl({
                    src: soundFiles
                });
            });
        }
    };

    Sound.prototype.snmdLoadSet = function (setName) {
        /* Return if sound set is already loaded. */
        if (typeof this.snmdSoundSets[setName] !== "undefined") {
            return;
        }

        Logger.info('[Sound] Loading sound set "%s"', setName);
        $.ajax({
            'global': false,
            'url': "snd/" + setName + "/set.json",
            'dataType': 'json',
            'dataFilter': function (data, type) {
                return JSON.minify(data);
            },
            'success': function (json) {
                this.snmdLoadSetJSON(setName, json);
            }.bind(this),
            'error': function (jqXHR, textStatus, errorThrown) {
                Logger.error('[Sound] Failed to load set config: %s - %s', textStatus, errorThrown);
            }
        });
    };

    Sound.prototype.snmdPlay = function (setName, soundName) {
        if (this.snmdMuted) {
            return;
        }

        if (typeof this.snmdSoundSets[setName] === "undefined") {
            Logger.warn("[Sound] Unable to play %s/%s: unknown sound set.", setName, soundName);
            return;
        }

        if (typeof this.snmdSoundSets[setName][soundName] === "undefined") {
            Logger.warn("[Sound] Unable to play %s/%s: sound is not part of the set.", setName, soundName);
            return;
        }

        this.snmdSoundSets[setName][soundName].play();
    };
    
    Sound.prototype.snmdMute = function () {
        this.snmdMuted = true;
    };

    Sound.prototype.snmdUnmute = function () {
        this.snmdMuted = false;
    };

    return Sound.getInstance();
});
