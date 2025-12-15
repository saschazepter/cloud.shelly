import initMeasureTemperatureDevice
  from '@drenso/homey-zigbee-library/capabilities/measureTemperature';
import initTargetTemperatureDevice
  from '@drenso/homey-zigbee-library/capabilities/targetTemperature';
import {ZigBeeNode} from 'homey';
import {type Bitmap, CLUSTER, ZCLNode} from 'zigbee-clusters';
import ShellyZigbeeDevice from '../../lib/device/zigbee/ShellyZigbeeDevice';

type BluTrvAlarmMask = Bitmap<['initializationFailure', 'hardwareFailure', 'selfCalibrationFailure']>;

type BluTrvSettings = {
  minSetpoint: number;
  maxSetpoint: number;
}

module.exports = class ShellyBluTrvZigbeeDevice extends ShellyZigbeeDevice {
  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode }): Promise<void> {
    await super.onNodeInit(payload);

    await initMeasureTemperatureDevice(this, payload.zclNode, {
      attributeName: 'localTemperature',
      cluster: CLUSTER.THERMOSTAT,
    });
    await initTargetTemperatureDevice(this, payload.zclNode);
    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION);

    if (this.isFirstInit()) {
      await this.configureAttributeReporting([
        {
          cluster: CLUSTER.THERMOSTAT,
          attributeName: 'alarmMask',
        }
      ]);
    }

    this.zclNode.endpoints[1].clusters[CLUSTER.THERMOSTAT.NAME].on('attr.alarmMask', (data: BluTrvAlarmMask) => {
      this.setCapabilityValue('alarm_problem', data.getBits().includes('selfCalibrationFailure')).catch(this.error);
    });
  }

  async onSettings({oldSettings, newSettings, changedKeys}: SettingsEvent<BluTrvSettings>): Promise<string | void> {
    const newAttributes: Record<string, unknown> = {};
    if (changedKeys.includes('minSetpoint')) {
      newAttributes['minHeatSetpointLimit'] = newSettings['minSetpoint'];
    }

    if (changedKeys.includes('maxSetpoint')) {
      newAttributes['maxHeatSetpointLimit'] = newSettings['maxSetpoint'];
    }

    if (Object.keys(newAttributes).length > 0) {
      await this.zclNode.endpoints[1].clusters[CLUSTER.THERMOSTAT.NAME]?.writeAttributes(newAttributes);
    }

    await super.onSettings({oldSettings, newSettings, changedKeys});
  }
};
