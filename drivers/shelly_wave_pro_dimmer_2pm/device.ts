import ShellyZwaveDevice from '../../lib/device/ShellyZwaveDevice';
import {
  convertIncomingActionEvent,
  type ShellyActionEvent,
} from '../../lib/flow/trigger/ActionEventTrigger';

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
    for (const multiChannelNodeId of [1, 2]) {
      const dimChannel = multiChannelNodeId - 1;
      this.registerMultiChannelReportListener(
        multiChannelNodeId,
        'SWITCH_MULTILEVEL',
        'SWITCH_MULTILEVEL_REPORT',
        report => this.handleDimReport(dimChannel, report),
      );

      if (this.dimValues[dimChannel] !== null) {
        continue;
      }

      await this
        .getCommandClass('SWITCH_MULTILEVEL', {multiChannelNodeId})
        .SWITCH_MULTILEVEL_GET()
        .then(result => this.handleDimReport(dimChannel, result))
        .catch(this.error);
    }

    // Button report listeners
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', notification => {
      try {
        const button = notification['Scene Number'];
        const action = notification['Properties1']['Key Attributes'];

        const parsedAction = {
          action: convertIncomingActionEvent(action, 'zwave') + `_${button}`,
        };

        this.homey.flow.getDeviceTriggerCard('triggerActionEvent')
          .trigger(this, parsedAction, parsedAction);

      } catch (e) {
        this.error('Failed parsing scene notification', JSON.stringify(notification), e);
      }
    });

    // Switch binary does not seem to work as it should. When the button is configured in switch mode,
    // it still behaves as a toggle button, which means that the value of the switch input does not
    // reflect what the user would expect.
    // for (const multiChannelNodeId of [3, 4, 5, 6]) {
    //   this.registerMultiChannelReportListener(multiChannelNodeId, 'SWITCH_BINARY', 'SWITCH_BINARY_REPORT', report => {
    //     this.log('report', multiChannelNodeId, JSON.stringify(report));
    //   });
    // }
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    const result: ShellyActionEvent[] = [];

    for (const input of [1, 2, 3, 4] as const) {
      // The available events depend on the button settings, the need to be momentary and detached for this to work
      if (this.getSetting(`zwaveSwitchTypeSW${input}`) == 0 && this.getSetting(`zwaveOutputDetached${input}`) == '1') {
        result.push(`single_push_${input}`, `double_push_${input}`, `hold_${input}`, `released_${input}`);
      }
    }

    return result;
  }

  private async configureSubDevice(): Promise<void> {
    this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
    this.registerCapability('measure_power', 'METER');
    this.registerCapability('meter_power', 'METER');
  }

  private handleDimReport(channel: number, report: { 'Current Value (Raw)': number[] }): void {
    // eslint-disable-next-line no-prototype-builtins
    if (!report.hasOwnProperty('Current Value (Raw)')) {
      return;
    }

    const reportValue = report['Current Value (Raw)'][0];
    this.debug('Handling new dim value', channel, reportValue);
    this.dimValues[channel] = reportValue === 255 ? 1 : (reportValue / 99);

    let dimAverage = 0;
    for (const dimValue of this.dimValues) {
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
