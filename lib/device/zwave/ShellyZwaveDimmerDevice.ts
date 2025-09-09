import ShellyZwaveDevice, {NumInput} from './ShellyZwaveDevice';

export class ShellyZwaveDimmerDevice extends ShellyZwaveDevice
{
  protected readonly switchChannels: Array<NumInput> = [1, 2];
  protected switchDetached = true;

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
}
