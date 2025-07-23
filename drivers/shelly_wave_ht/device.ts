import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {type ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";

type HumidityTemperatureHomeySettings = {
  remote_device_reboot: boolean;
  power_source_selection: '0' | '1';
  factory_reset: boolean;
  temperature_threshold: number;
  temperature_offset: number;
  humidity_threshold: number;
  humidity_offset: number;
}

module.exports = class ShellyWaveHTDevice extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('measure_battery', 'BATTERY');

    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    // No action events for this device
    return [];
  }

  async onSettings({oldSettings, newSettings, changedKeys}: SettingsEvent<HumidityTemperatureHomeySettings>): Promise<string | void> {
    await super.onSettings({oldSettings, newSettings, changedKeys});

    if (changedKeys.includes('temperature_threshold')) {
      await this.configurationSet({index: 161, size: 1, useSettingParser: true}, Math.round(newSettings['temperature_threshold'] * 10));
    }

    if (changedKeys.includes('temperature_offset')) {
      await this.configurationSet({index: 162, size: 2, useSettingParser: true}, Math.round(newSettings['temperature_offset'] * 10));
    }
  }
};
