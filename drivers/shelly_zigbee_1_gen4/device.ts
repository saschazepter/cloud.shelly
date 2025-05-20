import {ZigBeeDevice} from 'homey-zigbeedriver';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';
import initOnOffDevice from '@drenso/homey-zigbee-library/capabilities/onOff';

module.exports = class Shelly1Gen4ZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await super.onNodeInit(payload);

    await initOnOffDevice(this, payload.zclNode);
  }

};
