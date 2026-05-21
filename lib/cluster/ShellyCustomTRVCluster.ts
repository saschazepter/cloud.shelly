import { Cluster, ZCLDataTypes } from 'zigbee-clusters';

const Attributes = {
  manualMode: {
    // Manual mode (0 = auto, 1 = manual)
    id: 0x0000,
    type: ZCLDataTypes.uint8,
    manufacturerId: 0x1490,
  },
  valvePosition: {
    // Valve position (0-100%)
    id: 0x0001,
    type: ZCLDataTypes.uint8,
    manufacturerId: 0x1490,
  },
} as const;

const CommandsReceived = {
  calibrate: {
    id: 0x00,
    direction: Cluster.DIRECTION_CLIENT_TO_SERVER,
    manufacturerId: 0x1490,
  },
} as const;

class ShellyCustomTRVCluster extends Cluster<typeof Attributes, typeof CommandsReceived> {
  static get ID(): number {
    return 0xFC24;
  }

  static get NAME(): string {
    return 'ShellyCustomTRVCluster';
  }

  static get ATTRIBUTES(): typeof Attributes {
    return Attributes;
  }

  static get COMMANDS(): typeof CommandsReceived {
    return {
      ...CommandsReceived,
    };
  }
}

Cluster.addCluster(ShellyCustomTRVCluster);

export default ShellyCustomTRVCluster;
