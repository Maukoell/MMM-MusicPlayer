"use strict";

const NodeHelper = require("node_helper");
const gpio = require("onoff");
var path = require('path');
var fs = require('fs');
const { Howl, Howler } = require('howler');
var sound;
var musicList = [];
var index = 0;
var started;
var config;
module.exports = NodeHelper.create({
    start: function () {
        started = false;
    },
    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        const self = this;
        if (notification === 'BUTTON_CONFIG' && started === false) {
            config = payload;
            self.fromDir(config.musicPath, "mp3");
            self.createSound();
            var GPIO = require('onoff').Gpio;
            var button1 = new GPIO(config.playButtonPIN, 'in', 'both', { persistentWatch: true, debounceTimeout: config.clickDelay });
            button1.watch(function (err, state) {
                // 1 == pressed, 0 == not pressed
                if (state === 1) {

                    if (sound.playing()) {
                        sound.pause();
                    } else {
                        sound.play();
                    }
                }
            });
            var button2 = new GPIO(config.playButtonPIN, 'in', 'both', { persistentWatch: true, debounceTimeout: config.clickDelay });
            button2.watch(function (err, state) {
                // 1 == pressed, 0 == not pressed
                if (state === 1) {
                    self.playNext();
                }
            });
                started = true;
        }
    },

    fromDir: function(startPath, filter) {
        if (!fs.existsSync(startPath)) {
            Log.info("no dir ", startPath);
            return;
        }
    
        var files = fs.readdirSync(startPath);
        var i;
        var fullPath;
        var filename;
        var stat;
        for (i = 0; i < files.length; i+=1) {
            fullPath = path.join(startPath, files[i]);
            filename = files[i];
            stat = fs.lstatSync(fullPath);
            if (stat.isFile()) {
                if (filename.indexOf(filter) >= 0) {
                    musicList.push(fullPath);
                }
            }
        }
    },

    playNext: function() {
        if (sound.playing()) {
            sound.stop();
        }
        index += 1;
        if (index === musicList.length()) {
            index = 0;
        }
        sound.play(index);
    },

    createSound: function() {
        sound = new Howl({
            src: musicList
        });
    }

}
);