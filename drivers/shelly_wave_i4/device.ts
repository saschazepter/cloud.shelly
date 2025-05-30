import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {type ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";

module.exports = class ShellyWaveI4Device extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    for (const multiChannelNodeId of [2, 3, 4, 5]) {
      const inputChannel = multiChannelNodeId - 1;
      const capability = `input_${inputChannel}`;
      this.registerMultiChannelReportListener(multiChannelNodeId, 'SWITCH_BINARY', 'SWITCH_BINARY_REPORT', async report => {
        const inputChanged = this.homey.flow.getDeviceTriggerCard(`triggerInput${inputChannel}Changed`);
        if (report['Target Value'] === 'on/enable') {
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

    for (const input of [1, 2, 3, 4] as const) {
      // The available events depend on the button settings, they need to be momentary for this to work
      if (this.getSetting(`zwaveSwitchTypeSW${input}`) == 0) {
        result.push(`single_push_${input}`, `double_push_${input}`, `long_push_${input}`, `released_${input}`);
      }
    }

    return result;
  }

};
