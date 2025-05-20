import {ZigBeeDevice} from 'homey-zigbeedriver';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';
import initMeteringDevice from '@drenso/homey-zigbee-library/capabilities/metering';
import initElectricalMeasurementDevice
  from '@drenso/homey-zigbee-library/capabilities/electricalMeasurement';

module.exports = class ShellyEMMiniGen4ZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await super.onNodeInit(payload);

    await initMeteringDevice(this, payload.zclNode, {
      noPowerFactorReporting: true,
    });
    await initElectricalMeasurementDevice(this, payload.zclNode);
  }

};
