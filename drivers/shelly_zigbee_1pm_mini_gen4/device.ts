import initElectricalMeasurementDevice
  from '@drenso/homey-zigbee-library/capabilities/electricalMeasurement';
import initMeteringDevice from '@drenso/homey-zigbee-library/capabilities/metering';
import initOnOffDevice from '@drenso/homey-zigbee-library/capabilities/onOff';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';
import ShellyZigbeeDevice from '../../lib/device/zigbee/ShellyZigbeeDevice';

module.exports = class Shelly1PMMiniGen4ZigbeeDevice extends ShellyZigbeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode }): Promise<void> {
    await super.onNodeInit(payload);

    await initOnOffDevice(this, payload.zclNode);
    await initMeteringDevice(this, payload.zclNode, {
      noPowerFactorReporting: true,
    });
    await initElectricalMeasurementDevice(this, payload.zclNode);
  }

};
