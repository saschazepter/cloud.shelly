import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";

module.exports = class ShellyWavePMMiniDevice extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
  }
};
