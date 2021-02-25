'use strict';

const Homey = require('homey');
const Util = require('/lib/util.js');
const callbacks = [
  'shortpush',
  'longpush'
];
const callbacks_triggers = [
  'shortpush_1',
  'longpush_1',
  'shortpush_2',
  'longpush_2'
];

class Shelly1lDevice extends Homey.Device {

  onInit() {
    if (!this.util) this.util = new Util({homey: this.homey});

    this.homey.flow.getDeviceTriggerCard('triggerInput');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature1');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature2');
    this.homey.flow.getDeviceTriggerCard('triggerTemperature3');
    this.homey.flow.getDeviceTriggerCard('triggerOverpowered');

    this.setAvailable();

    // UPDATE INITIAL STATE
    this.initialStateUpdate();

    // LISTENERS FOR UPDATING CAPABILITIES
    this.registerCapabilityListener('onoff', async (value) => {
      const path = value ? '/relay/0?turn=on' : '/relay/0?turn=off';
      return await this.util.sendCommand(path, this.getSetting('address'), this.getSetting('username'), this.getSetting('password'));
    });

  }

  async onAdded() {
    return await this.homey.app.updateShellyCollection();
  }

  async onDeleted() {
    try {
      const iconpath = "/userdata/" + this.getData().id +".svg";
      await this.util.removeIcon(iconpath);
      await this.homey.app.updateShellyCollection();
      return;
    } catch (error) {
      this.log(error);
    }
  }

  // HELPER FUNCTIONS
  async initialStateUpdate() {
    try {
      let result = await this.util.sendCommand('/status', this.getSetting('address'), this.getSetting('username'), this.getSetting('password'), 'polling');
      if (!this.getAvailable()) { this.setAvailable(); }

      let onoff = result.relays[0].ison;
      let measure_power = result.meters[0].power;
      let meter_power = result.meters[0].total * 0.000017;
      let measure_temperature = result.temperature;
      let alarm_generic = result.inputs[0].input == 1 ? true : false;
      let alarm_generic_1 = result.inputs[1].input == 1 ? true : false;

      // capability onoff
      if (onoff != this.getCapabilityValue('onoff')) {
        this.setCapabilityValue('onoff', onoff);
      }

      // capability measure_power
      if (measure_power != this.getCapabilityValue('measure_power')) {
        this.setCapabilityValue('measure_power', measure_power);
      }

      // capability meter_power
      if (meter_power != this.getCapabilityValue('meter_power')) {
        this.setCapabilityValue('meter_power', meter_power);
      }

      // capability measure_temperature
      if (measure_temperature != this.getCapabilityValue('measure_temperature')) {
        this.setCapabilityValue('measure_temperature', measure_temperature);
      }

      // capability alarm_generic
      if (alarm_generic != this.getCapabilityValue('alarm_generic')) {
        this.setCapabilityValue('alarm_generic', alarm_generic);
      }

      // capability alarm_generic.1
      if (alarm_generic_1 != this.getCapabilityValue('alarm_generic.1')) {
        this.setCapabilityValue('alarm_generic.1', alarm_generic_1);
      }

    } catch (error) {
      this.setUnavailable(this.homey.__('device.unreachable') + error.message);
      this.log(error);
    }
  }

  async deviceCoapReport(capability, value) {
    try {
      if (!this.getAvailable()) { this.setAvailable(); }

      switch(capability) {
        case 'relay0':
          if (value != this.getCapabilityValue('onoff')) {
            this.setCapabilityValue('onoff', value);
          }
          break;
        case 'power0':
          if (value != this.getCapabilityValue('measure_power')) {
            this.setCapabilityValue('measure_power', value);
          }
          break;
        case 'energyCounter0':
          let meter_power = value * 0.000017;
          if (meter_power != this.getCapabilityValue('meter_power')) {
            this.setCapabilityValue('meter_power', meter_power);
          }
          break;
        case 'deviceTemperature':
          if (value != this.getCapabilityValue('measure_temperature')) {
            this.setCapabilityValue('measure_temperature', value);
          }
          break;
        case 'externalTemperature0':
          if (!this.hasCapability('measure_temperature.1')) {
            this.addCapability('measure_temperature.1');
          } else {
            if (value != this.getCapabilityValue('measure_temperature.1')) {
              this.setCapabilityValue('measure_temperature.1', value);
              this.homey.flow.getDeviceTriggerCard('triggerTemperature1').trigger(this, {'temperature': value}, {});
            }
          }
          break;
        case 'externalTemperature1':
          if (!this.hasCapability('measure_temperature.2')) {
            this.addCapability('measure_temperature.2');
          } else {
            if (value != this.getCapabilityValue('measure_temperature.2')) {
              this.setCapabilityValue('measure_temperature.2', value);
              this.homey.flow.getDeviceTriggerCard('triggerTemperature2').trigger(this, {'temperature': value}, {});
            }
          }
          break;
        case 'externalTemperature2':
          if (!this.hasCapability('measure_temperature.3')) {
            this.addCapability('measure_temperature.3');
          } else {
            if (value != this.getCapabilityValue('measure_temperature.3')) {
              this.setCapabilityValue('measure_temperature.3', value);
              this.homey.flow.getDeviceTriggerCard('triggerTemperature3').trigger(this, {'temperature': value}, {});
            }
          }
          break;
        case 'externalHumidity':
          if (!this.hasCapability('measure_humidity')) {
            this.addCapability('measure_humidity');
          } else {
            if (value != this.getCapabilityValue('measure_humidity')) {
              this.setCapabilityValue('measure_humidity', value);
            }
          }
          break;
        case 'externalInput0':
          if (!this.hasCapability('alarm_generic.external')) {
            this.addCapability('alarm_generic.external');
          } else {
            let alarm_external = value === 0 ? false : true;
            if (alarm_external != this.getCapabilityValue('alarm_generic.external')) {
              this.setCapabilityValue('alarm_generic.external', alarm_external);
              this.homey.flow.getDeviceTriggerCard('triggerInput').trigger(this, {'input': 'external switch 1', 'state': alarm_external.toString()}, {});
            }
          }
          break;
        case 'input0':
          let alarm_generic = value === 0 ? false : true;
          if (alarm_generic != this.getCapabilityValue('alarm_generic')) {
            this.setCapabilityValue('alarm_generic', alarm_generic);
            this.homey.flow.getDeviceTriggerCard('triggerInput').trigger(this, {'input': 'input 1', 'state': alarm_generic.toString()}, {});
          }
          break;
        case 'input1':
          let alarm_generic_1 = value === 0 ? false : true;
          if (alarm_generic_1 != this.getCapabilityValue('alarm_generic.1')) {
            this.setCapabilityValue('alarm_generic.1', alarm_generic_1);
            this.homey.flow.getDeviceTriggerCard('triggerInput').trigger(this, {'input': 'input 2', 'state': alarm_generic_1.toString()}, {});
          }
          break;
        case 'inputEvent0':
          let actionEvent1 = this.util.getActionEventDescription(value) + '_1';
          this.setStoreValue('actionEvent1', actionEvent1);
          break;
        case 'inputEvent1':
          let actionEvent2 = this.util.getActionEventDescription(value) + '_2';
          this.setStoreValue('actionEvent2', actionEvent2);
          break;
        case 'inputEventCounter0':
          if (value > 0) {
            this.homey.flow.getTriggerCard('triggerCallbacks').trigger({"id": this.getData().id, "device": this.getName(), "action": this.getStoreValue('actionEvent1')}, {"id": this.getData().id, "device": this.getName(), "action": this.getStoreValue('actionEvent1')});
          }
          break;
        case 'inputEventCounter1':
          if (value > 0) {
            this.homey.flow.getTriggerCard('triggerCallbacks').trigger({"id": this.getData().id, "device": this.getName(), "action": this.getStoreValue('actionEvent2')}, {"id": this.getData().id, "device": this.getName(), "action": this.getStoreValue('actionEvent2')});
          }
          break;
        case 'overPower':
          if (value) {
            this.homey.flow.getDeviceTriggerCard('triggerOverpowered').trigger(this, {}, {});
          }
          break;
        default:
          //this.log('Device does not support reported capability '+ capability +' with value '+ value);
      }
      return Promise.resolve(true);
    } catch(error) {
      this.log(error);
      return Promise.reject(error);
    }
  }

  getCallbacks() {
    return callbacks_triggers;
  }

}

module.exports = Shelly1lDevice;
