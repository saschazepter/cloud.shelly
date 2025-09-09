import {ZigBeeDevice} from 'homey-zigbeedriver';
import {ZigBeeNode} from 'homey';
import {OnOffCluster, ZCLNode} from 'zigbee-clusters';
import initOnOffDevice from '@drenso/homey-zigbee-library/capabilities/onOff';
import initMeteringDevice from '@drenso/homey-zigbee-library/capabilities/metering';
import initElectricalMeasurementDevice
  from '@drenso/homey-zigbee-library/capabilities/electricalMeasurement';

module.exports = class Shelly2PMGen4SwitchZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await super.onNodeInit(payload);
    try {
      await this.zclNode.endpoints[1].clusters[OnOffCluster.NAME]?.readAttributes(['onOff']);
    } catch (error) {
      if (error instanceof Error && error.message === 'UNSUPPORTED_CLUSTER') {
        this.log('Marking as unavailable, wrong type selected by user');
        await this.setUnavailable(this.homey.__('driver.wrongdevice'));
        return;
      }
      this.error(error);
    }
    const isSubDevice = this.isSubDevice();
    const endpointId = isSubDevice ? 2 : 1;

    await initOnOffDevice(this, payload.zclNode, {endpointId});
    await initMeteringDevice(this, payload.zclNode, {
      endpointId,
      noPowerFactorReporting: true,
    });
    await initElectricalMeasurementDevice(this, payload.zclNode, {endpointId});
  }

};
