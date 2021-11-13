'use strict';

const Homey = require('homey');
const Device = require('../device_local.js');
const Util = require('../../lib/util.js');
const tinycolor = require("tinycolor2");

class ShellyRGBW2ColorDevice extends Device {

  onInit() {
    if (!this.util) this.util = new Util({homey: this.homey});

    this.callbacks = [
      'longpush',
      'shortpush'
    ];

    this.homey.flow.getDeviceTriggerCard('triggerInput1On');
    this.homey.flow.getDeviceTriggerCard('triggerInput1Off');
    this.homey.flow.getDeviceTriggerCard('triggerInput1Changed');
    this.homey.flow.getDeviceTriggerCard('triggerOverpowered');

    this.setAvailable();

    // INITIAL UPDATE AND POLLING
    this.bootSequence();

    // LISTENERS FOR UPDATING CAPABILITIES
    this.registerCapabilityListener('onoff', async (value) => {
      const path = value ? '/color/0?turn=on' : '/color/0?turn=off';
      return await this.util.sendCommand(path, this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
    });

    this.registerCapabilityListener('dim', async (value, opts) => {
      if (opts.duration === undefined || typeof opts.duration == 'undefined') {
        opts.duration = '500';
      }
      const dim = value * 100;
      return await this.util.sendCommand('/color/0?gain='+ dim +'&transition='+ opts.duration +'', this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
    });

    this.registerCapabilityListener('light_temperature', async (value) => {
      const white = Number(this.util.denormalize(value, 0, 255));
      await this.setCapabilityValue('light_mode', 'temperature');

      if (white > 125 && !this.getCapabilityValue('onoff.whitemode')) {
        this.updateCapabilityValue('onoff.whitemode', true);
      } else if (white <= 125 && this.getCapabilityValue('onoff.whitemode')) {
        this.updateCapabilityValue('onoff.whitemode', false);
      }

      return await this.util.sendCommand('/color/0?white='+ white, this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
    });

    this.registerMultipleCapabilityListener(['light_hue', 'light_saturation' ], async ( valueObj, optsObj ) => {
      if (typeof valueObj.light_hue !== 'undefined') {
        var hue_value = valueObj.light_hue;
      } else {
        var hue_value = this.getCapabilityValue('light_hue');
      }
      if (typeof valueObj.light_saturation !== 'undefined') {
        var saturation_value = valueObj.light_saturation;
      } else {
        var saturation_value = this.getCapabilityValue('light_saturation');
      }
      let color = tinycolor.fromRatio({ h: hue_value, s: saturation_value, v: this.getCapabilityValue('dim') });
      let rgbcolor = color.toRgb();
      await this.setCapabilityValue('light_mode', 'color');
      return await this.util.sendCommand('/color/0?red='+ Number(rgbcolor.r) +'&green='+ Number(rgbcolor.g) +'&blue='+ Number(rgbcolor.b) +'', this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
    }, 500);

    this.registerCapabilityListener('onoff.whitemode', async (value) => {
      if (value) {
        this.setCapabilityValue('light_mode', 'temperature');
        return await this.util.sendCommand('/color/0?gain=0&white=255', this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
      } else {
        this.setCapabilityValue("light_mode", 'color');
        return await this.util.sendCommand('/color/0?gain=100&white=0', this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
      }
    });

    this.registerCapabilityListener('light_mode', async (value) => {

    });

  }

}

module.exports = ShellyRGBW2ColorDevice;