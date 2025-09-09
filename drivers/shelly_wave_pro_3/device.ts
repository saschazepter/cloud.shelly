import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";

module.exports = class ShellyWavePro3Device extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_BINARY');
  }
};
