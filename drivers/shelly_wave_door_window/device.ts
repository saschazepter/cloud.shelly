import ShellyZwaveDevice from '../../lib/device/ShellyZwaveDevice';
import {type ShellyActionEvent} from '../../lib/flow/trigger/ActionEventTrigger';

module.exports = class ShellyWaveDoorWindowDevice extends ShellyZwaveDevice {
  protected async configureDevice(): Promise<void> {
    this.registerCapability('alarm_contact', 'NOTIFICATION');
    this.registerCapability('measure_battery', 'BATTERY');
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL', {
      reportParser: (report: Record<string, unknown>) => {
        if (!this.getSetting('zwaveIlluminationMeasurement')) {
          return null;
        }

        if (
          report
          && report.hasOwnProperty('Sensor Type') // eslint-disable-line no-prototype-builtins
          && report.hasOwnProperty('Sensor Value (Parsed)') // eslint-disable-line no-prototype-builtins
        ) {
          if (report['Sensor Type'] === 'Luminance (version 1)') return report['Sensor Value (Parsed)'];
        }
        return null;
      },
    });

    this.registerCapability('tilt', 'SENSOR_MULTILEVEL', {
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: (report: Record<string, unknown>) => {
        if (!this.getSetting('zwaveTiltingMeasurement')) {
          return null;
        }

        if (
          report
          && report.hasOwnProperty('Sensor Type') // eslint-disable-line no-prototype-builtins
          && report.hasOwnProperty('Sensor Value (Parsed)') // eslint-disable-line no-prototype-builtins
        ) {
          if (report['Sensor Type'] === 'Direction (version 2) ') {
            return report['Sensor Value (Parsed)'];
          }
        }

        return null;
      },
    });
  }

  async onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    if (changedKeys.includes('zwaveIlluminationMeasurement') && !newSettings['zwaveIlluminationMeasurement']) {
      this.setCapabilityValue('measure_luminance', null).catch(this.error);
    }

    if (changedKeys.includes('zwaveTiltingMeasurement') && !newSettings['zwaveTiltingMeasurement']) {
      this.setCapabilityValue('tilt', null).catch(this.error);
    }

    await super.onSettings({oldSettings, newSettings, changedKeys});
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    // No action events for this device
    return [];
  }
};
