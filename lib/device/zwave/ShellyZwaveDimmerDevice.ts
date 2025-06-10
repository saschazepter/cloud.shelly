import ShellyZwaveDevice from "./ShellyZwaveDevice";
import {type ShellyActionEvent} from '../../flow/trigger/ActionEventTrigger';

export class ShellyZwaveDimmerDevice extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    if (!this.hasCapability('onoff')) {
      await this.addCapability('onoff').catch(this.error);
    }

    if (!this.hasCapability('actionEvents')) {
      await this.addCapability('actionEvents').catch(this.error);
    }

    this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {multiChannelNodeId: 1});

    this.registerCapability('dim', 'SWITCH_MULTILEVEL', {multiChannelNodeId: 1});

    this.registerCapability('measure_power', 'METER', {multiChannelNodeId: 1});

    this.registerCapability('meter_power', 'METER', {multiChannelNodeId: 1});

    for (const multiChannelNodeId of [2, 3]) {
      const inputChannel = multiChannelNodeId - 1;
      const capability = `input_${inputChannel}`;
      this.registerMultiChannelReportListener(multiChannelNodeId, 'SWITCH_BINARY', 'SWITCH_BINARY_REPORT', async report => {
        if (!this.hasCapability(capability)) {
          this.error('Input received for an input channel that is not in detached mode:', inputChannel, JSON.stringify(report));
          return;
        }
        this.debug('Report for', capability, ':', JSON.stringify(report));
        const inputChanged = this.homey.flow.getDeviceTriggerCard(`triggerInput${inputChannel}Changed`);
        if (report['Target Value'] === 'on/enable' || report['Value'] === 'on/enable') {
          await this.setCapabilityValue(capability, true).then(async () => {
            await this.homey.flow.getDeviceTriggerCard(`triggerInput${inputChannel}On`).trigger(this).catch(this.error);
            await inputChanged.trigger(this).catch(this.error);
          }).catch(this.error);
        } else {
          await this.setCapabilityValue(capability, false).then(async () => {
            await this.homey.flow.getDeviceTriggerCard(`triggerInput${inputChannel}Off`).trigger(this).catch(this.error);
            await inputChanged.trigger(this).catch(this.error);
          }).catch(this.error);
        }
      });
    }

    this.initializeButtonScenes();
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    const result: ShellyActionEvent[] = [];

    for (const input of [1, 2] as const) {
      // The available events depend on the button settings, they need to be momentary and detached for this to work
      if (this.getSetting(`zwaveSwitchTypeSW${input}`) == 0 && this.getSetting(`zwaveOutputDetached${input}`) == '1') {
        result.push(`single_push_${input}`, `double_push_${input}`, `long_push_${input}`, `released_${input}`);
      }
    }

    return result;
  }

  protected async firstInitConfigureDevice(): Promise<void> {
    for (const inputChannel of [1, 2]) {
      const zwaveDetachedModeRaw = await this.configurationGet({index: 6 + inputChannel});
      const zwaveDetachedModeArray = Array.from(zwaveDetachedModeRaw['Configuration Value']);
      const zwaveDetachedMode = zwaveDetachedModeArray[0];
      const capability = `input_${inputChannel}`;

      if (Number(zwaveDetachedMode) === 1) {
        if (!this.hasCapability(capability)) {
          await this.addCapability(capability).catch(this.error);
        }
      } else {
        if (this.hasCapability(capability)) {
          await this.removeCapability(capability).catch(this.error);
        }
      }
    }
  }

  async onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    for (const inputChannel of [1, 2]) {
      const capability = `input_${inputChannel}`;
      if (changedKeys.includes(`zwaveOutputDetached${inputChannel}`)) {
        if (Number(newSettings[`zwaveOutputDetached${inputChannel}`]) === 1) {
          if (!this.hasCapability(capability)) {
            await this.addCapability(capability);
          }
        } else {
          if (this.hasCapability(capability)) {
            await this.removeCapability(capability);
          }
        }
      }
    }
    return await super.onSettings({oldSettings, newSettings, changedKeys});
  }

}
