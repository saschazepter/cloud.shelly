import ShellyZwaveDevice, {NumInput} from "../../lib/device/zwave/ShellyZwaveDevice";

module.exports = class ShellyWaveI4Device extends ShellyZwaveDevice
{
  protected switchChannels: Array<NumInput> = [1, 2, 3, 4];

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
};
