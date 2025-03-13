import Homey, {type ZwaveNode} from 'homey';
import {ZwaveDevice} from 'homey-zwavedriver';
import ShellyZwaveDriver from '../driver/ShellyZwaveDriver';
import type {ShellyActionEvent} from '../flow/trigger/ActionEventTrigger';
import Logger from '../log/Logger';
import type {ShellyDeviceInterface} from './ShellyDevice';

export default abstract class ShellyZwaveDevice extends ZwaveDevice implements ShellyDeviceInterface {
  protected logger?: Logger = undefined;
  private startupTimeout: NodeJS.Timeout | null = null;

  public async onInit(): Promise<void> {
    return super.onInit();
  }

  public async onNodeInit(payload: { node: ZwaveNode }): Promise<void> {
    this.logger = new Logger(
      this, super.log, super.error,
      this.node.isMultiChannelNode ? `chan:${this.node.multiChannelNodeId}` : 'main',
    );

    if (Homey.env.DEBUG === '1') {
      this.enableDebug();
    }

    // Mark as unavailable during startup
    await this.setUnavailable(this.homey.__('device.startup'));

    await this.setLegacyStoreValues();

    this.startupTimeout = this.homey.setTimeout(
      () => this.doConfiguration().catch(this.error),
      this.getDriver().getStartupTimeout(),
    );

    return super.onNodeInit(payload);
  }

  public async onUninit(): Promise<void> {
    this.homey.clearTimeout(this.startupTimeout);

    return super.onUninit();
  }

  private async doConfiguration(): Promise<void> {
    try {
      this.debug('Starting configuration...');

      // Let the device configure itself
      await this.configureDevice(!this.node.isMultiChannelNode);

      if (this.hasCapability('button.reset_meter')) {
        this.registerCapabilityListener('button.reset_meter', async () => {
          this.log('Trying to reset meter');
          await this.meterReset();
        });
      }

      // Mark as available
      await this.setAvailable();

      this.debug('Configuration completed!');
    } finally {
      this.getDriver().markInitialized();
    }
  }

  /**
   * Configures the legacy store values for the device.
   * This ensures compatibility with the pre-2025 implementation.
   */
  private async setLegacyStoreValues(): Promise<void> {
    // Make sure the device is recognised as Z-Wave device
    await this.setStoreValue('communication', 'zwave');
    await this.setStoreValue('gen', 'zwave');

    // Set the right channel for the device
    const deviceChannel = this.node.isMultiChannelNode ? this.node.multiChannelNodeId : 0;
    await this.setStoreValue('channel', deviceChannel);
  }

  onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    this.log('Updating settings:', JSON.stringify(changedKeys), JSON.stringify(newSettings));
    return super.onSettings({oldSettings, newSettings, changedKeys});
  }

  public abstract getPossibleActionEvents(): ShellyActionEvent[];

  /** Use this method to configure the device specific capabilities */
  protected abstract configureDevice(isMainNode: boolean): Promise<void>;

  protected getDriver(): ShellyZwaveDriver {
    return this.driver as ShellyZwaveDriver;
  }

  public log(...args: unknown[]): void {
    this.logger ? this.logger.log(...args) : super.log(...args);
  }

  public error(...args: unknown[]): void {
    this.logger ? this.logger.error(...args) : super.error(...args);
  }

  public debug(...args: unknown[]): void {
    this.logger?.debug(...args);
  }
}
