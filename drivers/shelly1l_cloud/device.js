'use strict';

const Homey = require('homey');
const Device = require('../device_cloud.js');
const Util = require('../../lib/util.js');

class Shelly1lCloudDevice extends Device {

  onInit() {
    if (!this.util) this.util = new Util({homey: this.homey});

    this.callbacks = [];

    this.homey.flow.getDeviceTriggerCard('triggerInput1On');
    this.homey.flow.getDeviceTriggerCard('triggerInput1Off');
    this.homey.flow.getDeviceTriggerCard('triggerInput1Changed');
    this.homey.flow.getDeviceTriggerCard('triggerInput2On');
    this.homey.flow.getDeviceTriggerCard('triggerInput2Off');
    this.homey.flow.getDeviceTriggerCard('triggerInput2Changed');
    this.homey.flow.getDeviceTriggerCard('triggerInputExternal1On');
    this.homey.flow.getDeviceTriggerCard('triggerInputExternal1Off');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature1');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature2');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature3');
    this.homey.flow.getDeviceTriggerCard('triggerOverpowered');

    this.setAvailable();

    // INITIAL UPDATE AND POLLING
    this.bootSequence();

    // LISTENERS FOR UPDATING CAPABILITIES
    this.registerCapabilityListener('onoff', async (value) => {
      const turn = value ? 'on' : 'off';
      return await this.util.sendCloudCommand('/device/relay/control/', this.getSetting('server_address'), this.getSetting('cloud_token'), this.getSetting('device_id'), {"channel": this.getStoreValue('channel'), "turn": turn});
    });

  }

}

module.exports = Shelly1lCloudDevice;
