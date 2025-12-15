import Homey, {ZigBeeNode} from 'homey';
import {ZigBeeDevice} from 'homey-zigbeedriver';
import {debug, ZCLNode} from 'zigbee-clusters';

export default class ShellyZigbeeDevice extends ZigBeeDevice {
  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode }): Promise<void> {
    if (Homey.env.DEBUG === '1') {
      this.enableDebug();
      debug();
    }

    return super.onNodeInit(payload);
  }
}
