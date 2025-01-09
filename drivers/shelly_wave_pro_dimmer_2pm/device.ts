import ShellyZwaveDevice from '../../lib/device/ShellyZwaveDevice';

module.exports = class ShellyWaveProDimmer2PMDevice extends ShellyZwaveDevice {
  private dimValues: Array<number | null> = [null, null];

  protected async configureDevice(isMainNode: boolean): Promise<void> {
    return (isMainNode ? this.configureMainDevice() : this.configureSubDevice());
  }

  private async configureMainDevice(): Promise<void> {
    this.dimValues = this.getStoreValue('dim_values') ?? [null, null];
    this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {
      getOpts: {
        getOnStart: false,
      },
    });
    this.registerCapability('dim', 'SWITCH_MULTILEVEL', {
      getOpts: {
        getOnStart: false,
      },
    });

    // Listen to the different channel reports to update main device onoff/dim capabilities
    [1, 2].forEach((multiChannelNodeId, idx) => {
      this.registerMultiChannelReportListener(
        multiChannelNodeId,
        'SWITCH_MULTILEVEL',
        'SWITCH_MULTILEVEL_REPORT',
        (report) => this.handleDimReport(idx, report),
      );

      if (this.dimValues[idx] !== null) {
        return;
      }

      this.node
        .MultiChannelNodes[multiChannelNodeId]
        .CommandClass
        .COMMAND_CLASS_SWITCH_MULTILEVEL
        .SWITCH_MULTILEVEL_GET()
        .then((result: any) => this.handleDimReport(idx, result))
        .catch(this.error);
    });
  }

  private async configureSubDevice(): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
  }

  private handleDimReport(channel: number, report: any): void {
    if (!report.hasOwnProperty('Current Value (Raw)')) {
      return;
    }

    const reportValue = report['Current Value (Raw)'][0];
    this.debug('Handling new dim value', channel, reportValue)
    this.dimValues[channel] = reportValue === 255 ? 1 : (reportValue / 99);

    let dimAverage = 0;
    for (let dimValue of this.dimValues) {
      if (dimValue === null) {
        // Not fully initialised, yet
        return;
      }

      dimAverage += dimValue;
    }

    this.setCapabilityValue('onoff', dimAverage !== 0).catch(this.error);
    this.setCapabilityValue('dim', dimAverage / this.dimValues.length).catch(this.error);
    this.setStoreValue('dim_values', this.dimValues).catch(this.error);
  }
};
