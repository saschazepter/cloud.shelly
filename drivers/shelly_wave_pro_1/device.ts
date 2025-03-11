import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";

module.exports = class ShellyWavePro1Device extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_BINARY');
  }

  getPossibleActionEvents(): ShellyActionEvent[] {
    return [];
  }

};
