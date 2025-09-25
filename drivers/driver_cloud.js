'use strict';

const Homey = require('homey');
const { OAuth2Driver } = require('homey-oauth2app');
const { jwtDecode } = require('jwt-decode');
const Util = require('../lib/util.js');
let selectedDevice = {};

class ShellyCloudDriver extends OAuth2Driver {

  async onPair(socket) {
    if (!this.util) this.util = new Util({homey: this.homey});

    await super.onPair(socket);

    socket.setHandler('list_devices_selection', async (data) => {
      return selectedDevice = data[0];
    });

    socket.setHandler('add_device_cloud', async () => {
      try {
        return Promise.resolve(selectedDevice);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  async onPairListDevices({ oAuth2Client }) {
    const oauth_token = await oAuth2Client.getToken();
    const cloud_details = await jwtDecode(oauth_token.access_token);
    const cloud_server = cloud_details.user_api_url.replace('https://', '');
    if (cloud_server === null) {
      this.error("No valid cloud server address found, please try again.");
      return;
    }

    const devices_data = await oAuth2Client.getCloudDevices(cloud_server);

    const devices = [];
    for (const [key, value] of Object.entries(devices_data.data.devices_status)) {
      this.debug('Cloud device', key, JSON.stringify(value));

      // Make sure _dev_info is present
      if (!value.hasOwnProperty('_dev_info')) {
        this.debug('_dev_info is missing, skipping')
        continue;
      }

      // We only want to pair online devices to avoid users complaining about unreachable devices
      if (!value._dev_info.online) {
        this.debug('Device offline, skipping')
        continue;
      }

      let device_ip;
      let cloud_device_id;

      // Get the IP address to allow device identification in the pairing wizard, it's location depends on device generation
      if (value._dev_info.gen === "G1") {
        device_ip = value.wifi_sta.ip || "";
        cloud_device_id = parseInt(String(key), 16);
      } else if (value._dev_info.gen === "G2") {
        device_ip = value.wifi.sta_ip || "";
        cloud_device_id = parseInt(String(key), 16);
      } else if (value._dev_info.gen === "GBLE") {
        device_ip = value._dev_info.id;
        cloud_device_id = value._dev_info.id;
      }

      // Cloud device id is required
      if (!cloud_device_id) {
        this.debug('No device id, skipping');
        continue;
      }

      const device_code = value._dev_info.code; // get the device code

      /* get device config based on device type of the discovered devices */
      let device_config = this.util.getDeviceConfig(device_code, 'type');

      if (typeof device_config === 'undefined') {
        this.error('No device config found for device with device code', device_code);
        this.homey.app.homeyLog.captureMessage(`Device config missing for device code ${device_code}`).catch(this.error);

        continue;
      }

      /* update device config if it's a gen1 roller shutter */
      if (value._dev_info.gen === "G1" && (device_code === 'SHSW-21' || device_code === 'SHSW-25')) {
        if (value.hasOwnProperty("rollers")) {
          device_config = this.util.getDeviceConfig(device_config.hostname[0] + 'roller-', 'hostname');
        }
      }

      /* update device config if it's a gen1 RGBW2 in white mode */
      if (value._dev_info.gen === "G1" && device_code === 'SHRGBW2') {
        if (value.mode === 'white') {
          device_config = this.util.getDeviceConfig(device_config.hostname[0] + 'white-', 'hostname');
        }
      }

      /* update device config if it's a gen1 RGBW2 in rgb or white mode */
      if (device_code === 'SNDC-0D4P10WW') {
        if (value.hasOwnProperty('rgbw:0')) { // RGBW mode
          device_config = this.util.getDeviceConfig('shellyplusrgbwpm-rgbw', 'id');
        } else if (value.hasOwnProperty("rgb:0")) { // RGB mode
          device_config = this.util.getDeviceConfig('shellyplusrgbwpm-rgb', 'id');
        } else if (value.hasOwnProperty("light:3")) { // Lights mode
          device_config = this.util.getDeviceConfig('shellyplusrgbwpm-light', 'id');
        }
      }

      /* update device config if it's a gen2 roller shutter */
      if (value._dev_info.gen === "G2" && value.hasOwnProperty("cover:0")) {
        device_config = this.util.getDeviceConfig(device_config.hostname[0] + 'roller-', 'hostname');
      }

      device_config.communication = 'cloud';

      if (typeof device_config === 'undefined') {
        this.error('No device config found for device with device code', device_code);
        this.homey.app.homeyLog.captureMessage(`Device config missing for device code ${device_code}`).catch(this.error);

        continue;
      }

      devices.push({
        name: device_config.name + ' [' + device_ip + ']',
        class: device_config.class,
        data: {
          id: String(key),
        },
        settings: {
          cloud_server: cloud_server,
          cloud_device_id: cloud_device_id,
        },
        capabilities: device_config.capabilities_1,
        capabilitiesOptions: device_config.capability_options,
        energy: device_config.energy,
        store: {
          config: device_config,
          main_device: String(key),
          channel: 0,
          type: device_code,
          battery: device_config.battery,
          sdk: 3,
          gen: device_config.gen,
          communication: 'cloud',
        },
        icon: device_config.icon,
      });
    }

    return devices;
  }

  debug(...args) {
    if (Homey.env.DEBUG !== '1') {
      return;
    }

    this.log('[dbg]', ...args);
  }
}

module.exports = ShellyCloudDriver;
