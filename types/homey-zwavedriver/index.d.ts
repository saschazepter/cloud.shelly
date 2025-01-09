/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'homey-zwavedriver' {
  import Homey, {ZwaveNode} from 'homey';

  class ZwaveDevice extends Homey.Device {
    thermostatSetpointType: string;
    async onNodeInit({node: ZwaveNode}): Promise<void>;
    registerCapability(capabilityId: string, commandClassId: string, userOpts?: any): void;
    node: ZwaveNode;
    registerReportListener(commandClassId: string, commandId: string, triggerFn: (report: any) => void): void
    registerMultiChannelReportListener(multiChannelNodeId: number, commandClassId: string, commandId: string, triggerFn: (report: any) => void): void;
    enableDebug(): void;
    async configurationGet(options: {index: number}): Promise<any>;
    async configurationSet(options: {id: number, index: number, size: number, signed: boolean}, value: any)
    async getCommandClass(commandClassId: string): any;
    printNode(): void;
  }
}
