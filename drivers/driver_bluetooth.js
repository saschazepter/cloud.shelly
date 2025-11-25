'use strict';

const Util = require('../lib/util.js');
const ShellyDriver = require('../lib/driver/ShellyDriver');

class ShellyBluetoothDriver extends ShellyDriver.default {

  async onInit() {
    await super.onInit();
    if (!this.util) this.util = new Util({homey: this.homey});
  }

  async onPairListDevices() {
    try {
      let advertisements = {};
      const discovery_result = await this.homey.ble.discover([], 7000).catch(this.error);
      if (!discovery_result) {
        return Promise.reject('Homeys BLE discovery ran into an error. Try restarting Homey and try again.');
      }

      discovery_result.forEach(advertisement => {
        this.debug(`Found BLE device with uuid ${advertisement.uuid}`);

        if (!advertisement.hasOwnProperty('localName')) {
          return;
        }

        this.debug(`Found BLE device with name ${advertisement.localName}`);
        if (advertisements[advertisement.address] || !this.util.filterBLEDevices(advertisement.localName)) {
          return;
        }

        let device_config = this.util.getDeviceConfig(advertisement.localName, 'bluetooth');
        if (device_config) {
          advertisements[advertisement.address] = {};
          advertisements[advertisement.address].name = device_config.name + ' [' + advertisement.address + ']';
          advertisements[advertisement.address].device_config = device_config;
          advertisements[advertisement.address].type = advertisement.localName;
        } else {
          this.error('No suitable config for', advertisement.localName);
        }
      });

      return Object.entries(advertisements).map(([address, advertisement]) => ({
        name: advertisement.name,
        class: advertisement.device_config.class,
        data: {
          id: address,
        },
        capabilities: advertisement.device_config.capabilities_1,
        capabilitiesOptions: advertisement.device_config.capability_options,
        settings: advertisement.device_config.settings,
        energy: advertisement.device_config.energy,
        store: {
          config: advertisement.device_config,
          main_device: address,
          channel: 0,
          type: advertisement.type,
          unicast: false,
          wsserver: false,
          battery: advertisement.device_config.battery,
          sdk: 3,
          gen: advertisement.device_config.gen,
          communication: advertisement.device_config.communication,
        },
        icon: advertisement.device_config.icon,
      }));
    } catch (error) {
      this.error(error);
      return Promise.reject(error);
    }
  }
}

module.exports = ShellyBluetoothDriver;
