import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";

module.exports = class ShellyWavePlugDevice extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_BINARY');
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
  }

  getPossibleActionEvents(): ShellyActionEvent[] {
    return [];
  }

};
