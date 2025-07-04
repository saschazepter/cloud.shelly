'use strict';

const Homey = require('homey');
const Device = require('./device.js');
const { OAuth2Device } = require('homey-oauth2app');
const Util = require('../lib/util.js');

class ShellyCloudDevice extends OAuth2Device {

  async onOAuth2Init() {
    try {
      if (!this.util) this.util = new Util({homey: this.homey});

      // ADDING CAPABILITY LISTENERS
      this.registerMultipleCapabilityListener(["onoff", "onoff.light"], this.onMultipleCapabilityOnoff.bind(this));
      this.registerCapabilityListener("onoff.1", this.onCapabilityOnoff1.bind(this));
      this.registerCapabilityListener("onoff.2", this.onCapabilityOnoff2.bind(this));
      this.registerCapabilityListener("onoff.3", this.onCapabilityOnoff3.bind(this));
      this.registerCapabilityListener("onoff.4", this.onCapabilityOnoff4.bind(this));
      this.registerCapabilityListener("onoff.5", this.onCapabilityOnoff5.bind(this));
      this.registerMultipleCapabilityListener(["dim", "dim.light"], this.onMultipleCapabilityDim.bind(this));
      this.registerCapabilityListener("dim.white", this.onCapabilityDimWhite.bind(this));
      this.registerCapabilityListener("light_temperature", this.onCapabilityLightTemperature.bind(this));
      this.registerMultipleCapabilityListener(['light_hue', 'light_saturation'], this.onMultipleCapabilityListenerSatHue.bind(this), 500);
      this.registerCapabilityListener("light_mode", this.onCapabilityLightMode.bind(this));
      this.registerCapabilityListener("onoff.whitemode", this.onCapabilityOnoffWhiteMode.bind(this));
      this.registerCapabilityListener("windowcoverings_state", this.onCapabilityWindowcoveringsState.bind(this));
      this.registerCapabilityListener("windowcoverings_set", this.onCapabilityWindowcoveringsSet.bind(this));
      this.registerCapabilityListener("windowcoverings_tilt_set", this.onCapabilityWindowcoveringsTiltSet.bind(this));
      this.registerCapabilityListener("valve_position", this.onCapabilityValvePosition.bind(this));
      this.registerCapabilityListener("valve_mode", this.onCapabilityValveMode.bind(this));
      this.registerCapabilityListener("target_temperature", this.onCapabilityTargetTemperature.bind(this));

      // REGISTERING DEVICE TRIGGER CARDS
      this.homey.setTimeout(async () => {
        try {

          /* update device config */
          await this.updateDeviceConfig();

          /* register device trigger cards */
          let triggers = [];
          if (this.getStoreValue('config').triggers !== undefined) {
            triggers = this.getStoreValue('config').triggers
          } else if (this.getStoreValue('channel') !== 0) {
            triggers = this.getStoreValue('config').triggers_2
          } else {
            triggers = this.getStoreValue('config').triggers_1
          }
          for (const trigger of triggers) {
            this.homey.flow.getDeviceTriggerCard(trigger);
          }

          /* start cloud connection and initial status update */
          await this.bootSequence();

        } catch (error) {
          this.log(error);
        }
      }, 2000);


    } catch (error) {
      this.error(error);
    }
  }

  async bootSequence() {
    try {

      // initially set the device as available
      this.homey.setTimeout(async () => {
        await this.setAvailable().catch(this.error);
      }, 1000);

      // make sure there is a valid oauth2client (also for opening a websocket based on getFirstSavedOAuth2Client() )
      if (this.getStoreValue('OAuth2ConfigId') !== null) {
        this.oAuth2Client = this.homey.app.getOAuth2Client({
          sessionId: this.getStoreValue('OAuth2SessionId'),
          configId: this.getStoreValue('OAuth2ConfigId'),
        });
      }

    } catch (error) {
      this.error(error);
    }
  }

  async onOAuth2Added() {
    try {
      // update device collection and start cloud websocket listener (if needed)
      if (this.getStoreValue('channel') === 0) {
        this.homey.setTimeout(async () => {
          await this.homey.app.updateShellyCollection();
          await this.util.sleep(2000);
          this.homey.app.websocketCloudListener();
          return;
        }, 1000);
      }
    } catch (error) {
      this.error(error);
    }
  }

  async onOAuth2Deleted() {
    try {
      await this.homey.app.updateShellyCollection();
      await this.util.sleep(2000);
      return await this.homey.app.websocketClose();
    } catch (error) {
      this.error(error);
    }
  }

  async onOAuth2Uninit() {
    try {
      await this.homey.app.updateShellyCollection();
      await this.util.sleep(2000);
      return await this.homey.app.websocketClose();
    } catch (error) {
      this.error(error);
    }
  }

  debug(...args) {
    if (Homey.env.DEBUG !== '1') {
      return;
    }

    this.log('[dbg]', ...args);
  }

}

ShellyCloudDevice.prototype.updateCapabilityValue = Device.prototype.updateCapabilityValue;
ShellyCloudDevice.prototype.parseFullStatusUpdateGen1 = Device.prototype.parseFullStatusUpdateGen1;
ShellyCloudDevice.prototype.parseFullStatusUpdateGen2 = Device.prototype.parseFullStatusUpdateGen2;
ShellyCloudDevice.prototype.parseCapabilityUpdate = Device.prototype.parseCapabilityUpdate;
ShellyCloudDevice.prototype.onMultipleCapabilityOnoff = Device.prototype.onMultipleCapabilityOnoff;
ShellyCloudDevice.prototype.onCapabilityOnoff1 = Device.prototype.onCapabilityOnoff1;
ShellyCloudDevice.prototype.onCapabilityOnoff2 = Device.prototype.onCapabilityOnoff2;
ShellyCloudDevice.prototype.onCapabilityOnoff3 = Device.prototype.onCapabilityOnoff3;
ShellyCloudDevice.prototype.onCapabilityOnoff4 = Device.prototype.onCapabilityOnoff4;
ShellyCloudDevice.prototype.onCapabilityOnoff5 = Device.prototype.onCapabilityOnoff5;
ShellyCloudDevice.prototype.onCapabilityOnoffLight = Device.prototype.onCapabilityOnoffLight;
ShellyCloudDevice.prototype.onCapabilityWindowcoveringsState = Device.prototype.onCapabilityWindowcoveringsState;
ShellyCloudDevice.prototype.onCapabilityWindowcoveringsSet = Device.prototype.onCapabilityWindowcoveringsSet;
ShellyCloudDevice.prototype.onCapabilityWindowcoveringsTiltSet = Device.prototype.onCapabilityWindowcoveringsTiltSet;
ShellyCloudDevice.prototype.onMultipleCapabilityDim = Device.prototype.onMultipleCapabilityDim;
ShellyCloudDevice.prototype.onCapabilityDimWhite = Device.prototype.onCapabilityDimWhite;
ShellyCloudDevice.prototype.onCapabilityLightTemperature = Device.prototype.onCapabilityLightTemperature;
ShellyCloudDevice.prototype.onMultipleCapabilityListenerSatHue = Device.prototype.onMultipleCapabilityListenerSatHue;
ShellyCloudDevice.prototype.onCapabilityLightMode = Device.prototype.onCapabilityLightMode;
ShellyCloudDevice.prototype.onCapabilityOnoffWhiteMode = Device.prototype.onCapabilityOnoffWhiteMode;
ShellyCloudDevice.prototype.onCapabilityValvePosition = Device.prototype.onCapabilityValvePosition;
ShellyCloudDevice.prototype.onCapabilityValveMode = Device.prototype.onCapabilityValveMode;
ShellyCloudDevice.prototype.onCapabilityTargetTemperature = Device.prototype.onCapabilityTargetTemperature;
ShellyCloudDevice.prototype.updateDeviceRgb = Device.prototype.updateDeviceRgb;
ShellyCloudDevice.prototype.rollerState = Device.prototype.rollerState;
ShellyCloudDevice.prototype.triggerDeviceTriggerCard = Device.prototype.triggerDeviceTriggerCard;
ShellyCloudDevice.prototype.setAvailability = Device.prototype.setAvailability;
ShellyCloudDevice.prototype.updateDeviceConfig = Device.prototype.updateDeviceConfig;
ShellyCloudDevice.prototype.updateTemperatureSensor = Device.prototype.updateTemperatureSensor;
ShellyCloudDevice.prototype.updateEnergyConfiguration = Device.prototype.updateEnergyConfiguration;
ShellyCloudDevice.prototype.is3EMTriphase = Device.prototype.is3EMTriphase;

module.exports = ShellyCloudDevice;
