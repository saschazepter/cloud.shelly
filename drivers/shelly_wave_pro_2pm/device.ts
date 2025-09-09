import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";

module.exports = class ShellyWavePro2PMDevice extends ShellyZwaveDevice
{
  protected async configureDevice(isMainNode: boolean): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_BINARY');

    if (!isMainNode) {
      this.registerCapability('measure_power', 'METER');
      this.registerCapability('meter_power', 'METER');
    }
  }
};
