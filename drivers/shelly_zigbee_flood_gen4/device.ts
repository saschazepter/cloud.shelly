import initPowerConfigurationDevice
  from '@drenso/homey-zigbee-library/capabilities/powerConfiguration';
import initIasZoneDevice from '@drenso/homey-zigbee-library/lib/iasZoneDevice';
import {ZigBeeDevice} from 'homey-zigbeedriver';
import {ZigBeeNode} from 'homey';
import {ZCLNode} from 'zigbee-clusters';

module.exports = class ShellyFloodGen4ZigbeeDevice extends ZigBeeDevice {

  async onNodeInit(payload: { zclNode: ZCLNode; node: ZigBeeNode}): Promise<void> {
    await initPowerConfigurationDevice(this, payload.zclNode)
      .catch(e => this.error('Power configuration init failed', e));

    await initIasZoneDevice(
      this,
      payload.zclNode,
      ['alarm_water'],
      ['alarm1'],
      undefined,
      this.isFirstInit(),
    ).catch(e => this.error('IAS Zone init failed', e));

    await super.onNodeInit(payload);
  }
};
