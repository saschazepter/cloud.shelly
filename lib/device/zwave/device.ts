import type {ShellyActionEvent} from '../../flow/trigger/ActionEventTrigger';
import {addCapabilityIfNotExists, removeCapabilityIfAvailable} from '../../helper/Capabilities';
import ShellyZwaveDevice from '../ShellyZwaveDevice';

export class ShellyZWaveShutterDevice extends ShellyZwaveDevice {
  protected async configureDevice(): Promise<void> {
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
    this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL', {multiChannelNodeId: 1});
    this.registerCapability('windowcoverings_tilt_set', 'SWITCH_MULTILEVEL', {multiChannelNodeId: 2});
  }

  async onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    if (changedKeys.includes('zwaveShutterOperatingMode')) {
      // Check for venetian mode
      if (1 === Number(newSettings['zwaveShutterOperatingMode'])) {
        await addCapabilityIfNotExists(this, 'windowcoverings_tilt_set');
      } else {
        await removeCapabilityIfAvailable(this, 'windowcoverings_tilt_set');
      }
    }

    await super.onSettings({oldSettings, newSettings, changedKeys});
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    // No action events for this device
    return [];
  }
}
