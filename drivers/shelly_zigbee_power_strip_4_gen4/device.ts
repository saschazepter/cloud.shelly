import {ZigBeeDevice} from 'homey-zigbeedriver';
import Homey, {ZigBeeNode} from 'homey';
import {ZCLNode, debug} from 'zigbee-clusters';
import initOnOffDevice from '@drenso/homey-zigbee-library/capabilities/onOff';
import initMeteringDevice from '@drenso/homey-zigbee-library/capabilities/metering';
import initElectricalMeasurementDevice
  from '@drenso/homey-zigbee-library/capabilities/electricalMeasurement';

module.exports = class ShellyPowerStrip4Gen4ZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await super.onNodeInit(payload);
    if (Homey.env.DEBUG === '1') {
      this.enableDebug();
      debug(true);
    }
    let endpointId;
    if (this.isSubDevice()) {
      const { subDeviceId } = this.getData();
      endpointId = parseInt(subDeviceId.slice(-1));
    } else {
      endpointId = 1;
    }

    await initOnOffDevice(this, payload.zclNode, {endpointId});
    await initMeteringDevice(this, payload.zclNode, {
      endpointId,
      noPowerFactorReporting: true,
    });
    await initElectricalMeasurementDevice(this, payload.zclNode, {endpointId});
  }
};
