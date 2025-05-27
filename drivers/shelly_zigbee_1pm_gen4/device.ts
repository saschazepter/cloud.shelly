import {ZigBeeDevice} from 'homey-zigbeedriver';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';
import initOnOffDevice from '@drenso/homey-zigbee-library/capabilities/onOff';
import initMeteringDevice from '@drenso/homey-zigbee-library/capabilities/metering';
import initElectricalMeasurementDevice
  from '@drenso/homey-zigbee-library/capabilities/electricalMeasurement';

module.exports = class Shelly1PMGen4ZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await super.onNodeInit(payload);

    await initOnOffDevice(this, payload.zclNode);
    await initMeteringDevice(this, payload.zclNode, {
      noPowerFactorReporting: true,
    });
    await initElectricalMeasurementDevice(this, payload.zclNode);
  }

};
