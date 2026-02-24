import initMeasureTemperatureDevice
  from '@drenso/homey-zigbee-library/capabilities/measureTemperature';
import initTargetTemperatureDevice
  from '@drenso/homey-zigbee-library/capabilities/targetTemperature';
import {ZigBeeNode} from 'homey';
import {type Bitmap, Cluster, CLUSTER, ZCLNode} from 'zigbee-clusters';
import ShellyZigbeeDevice from '../../lib/device/zigbee/ShellyZigbeeDevice';
import ShellyCustomTRVCluster from "../../lib/cluster/ShellyCustomTRVCluster";
import {initReadOnlyCapability} from "@drenso/homey-zigbee-library/lib/attributeDevice";

type BluTrvAlarmMask = Bitmap<['initializationFailure', 'hardwareFailure', 'selfCalibrationFailure']>;

type BluTrvSettings = {
  minSetpoint: number;
  maxSetpoint: number;
}

type ShellyTRVCluster = Cluster & {
  calibrate: () => Promise<void>;
}

module.exports = class ShellyBluTrvZigbeeDevice extends ShellyZigbeeDevice {
  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode }): Promise<void> {
    await super.onNodeInit(payload);
    this.log('Alarm', await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.THERMOSTAT) ?? 1].clusters[CLUSTER.THERMOSTAT.NAME].readAttributes(['alarmMask']));

    await initMeasureTemperatureDevice(this, payload.zclNode, {
      attributeName: 'localTemperature',
      cluster: CLUSTER.THERMOSTAT,
    });
    await initTargetTemperatureDevice(this, payload.zclNode);
    this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION);

    await initReadOnlyCapability(this, payload.zclNode, 'alarm_problem', CLUSTER.THERMOSTAT, 'alarmMask', (data: BluTrvAlarmMask) => data.getBits().includes('selfCalibrationFailure'));

    if (this.isFirstInit()) {
      await this.setCapabilityValue('thermostat_mode', 'heat');
      const limits = await this.zclNode.endpoints[this.getClusterEndpoint(CLUSTER.THERMOSTAT) ?? 1].clusters[CLUSTER.THERMOSTAT.NAME].readAttributes(['minHeatSetpointLimit', 'maxHeatSetpointLimit']);
      const options = this.getCapabilityOptions('target_temperature');
      const settings = {
        minSetpoint: 4,
        maxSetpoint: 30,
      };
      if (limits.minheatSetpointLimit) {
        options.min = limits.minheatSetpointLimit / 100;
        settings.minSetpoint = limits.minheatSetpointLimit / 100;
      }
      if (limits.maxHeatSetpointLimit) {
        options.max = limits.maxHeatSetpointLimit / 100;
        settings.maxSetpoint = limits.maxHeatSetpointLimit / 100;
      }
      await this.setCapabilityOptions('target_temperature', options);
      await this.setSettings(settings);
    }
    // TODO implement manualMode and valvePosition

    this.registerCapabilityListener('button.calibrate', async () => {
      const cluster = this.zclNode.endpoints[this.getClusterEndpoint(ShellyCustomTRVCluster) ?? 1].clusters[ShellyCustomTRVCluster.NAME] as ShellyTRVCluster;
      await cluster.calibrate();
    });
  }

  async onSettings({oldSettings, newSettings, changedKeys}: SettingsEvent<BluTrvSettings>): Promise<string | void> {
    const newAttributes: Record<string, unknown> = {};
    const options = this.getCapabilityOptions('target_temperature');
    if (changedKeys.includes('minSetpoint')) {
      newAttributes['minHeatSetpointLimit'] = newSettings['minSetpoint'] * 100;
      options.min = newSettings['minSetpoint'];
    }

    if (changedKeys.includes('maxSetpoint')) {
      newAttributes['maxHeatSetpointLimit'] = newSettings['maxSetpoint'] * 100;
      options.max = newSettings['maxSetpoint'];
    }

    if (Object.keys(newAttributes).length > 0) {
      await this.zclNode.endpoints[1].clusters[CLUSTER.THERMOSTAT.NAME]?.writeAttributes(newAttributes);
      await this.setCapabilityOptions('target_temperature', options);
    }

    await super.onSettings({oldSettings, newSettings, changedKeys});
  }
};
