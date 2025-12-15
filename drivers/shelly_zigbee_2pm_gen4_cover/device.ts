import initWindowCoveringsDevice from '@drenso/homey-zigbee-library/capabilities/windowCoverings';
import WindowCoveringCluster from '@drenso/homey-zigbee-library/lib/clusters/WindowCoveringCluster';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';
import ShellyZigbeeDevice from '../../lib/device/zigbee/ShellyZigbeeDevice';

module.exports = class Shelly1PMGen4ZigbeeDevice extends ShellyZigbeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode }): Promise<void> {
    await super.onNodeInit(payload);

    try {
      await this.zclNode.endpoints[1].clusters[WindowCoveringCluster.NAME]?.readAttributes(['currentPositionLift1']);
    } catch (error) {
      if (error instanceof Error && error.message === 'UNSUPPORTED_CLUSTER') {
        this.log('Marking as unavailable, wrong type selected by user');
        await this.setUnavailable(this.homey.__('driver.wrongdevice'));
        return;
      }
      this.error(error);
    }

    await initWindowCoveringsDevice(this, payload.zclNode);
  }

};
