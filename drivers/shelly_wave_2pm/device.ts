import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";

module.exports = class ShellyWave2PMDevice extends ShellyZwaveDevice
{
  protected async configureDevice(isMainNode: boolean): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_BINARY');

    if (!isMainNode) {
      this.registerCapability('measure_power', 'METER');
      this.registerCapability('meter_power', 'METER');
    }
  }

  getPossibleActionEvents(): ShellyActionEvent[] {
    return [];
  }

};
