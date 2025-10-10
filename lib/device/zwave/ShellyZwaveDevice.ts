import Homey, {type ZwaveNode} from 'homey';
import {ZwaveDevice} from 'homey-zwavedriver';
import ShellyZwaveDriver from '../../driver/ShellyZwaveDriver';
import {convertIncomingActionEvent, ShellyActionEvent} from '../../flow/trigger/ActionEventTrigger';
import Logger from '../../log/Logger';
import type {ShellyDeviceInterface} from '../ShellyDevice';

export type NumInput = 1 | 2 | 3 | 4;

export default abstract class ShellyZwaveDevice extends ZwaveDevice implements ShellyDeviceInterface {
  protected logger?: Logger = undefined;
  private startupTimeout: NodeJS.Timeout | null = null;
  protected readonly switchChannels: Array<NumInput> = [];
  protected switchDetached = false;

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

      const mainNode = !this.node.isMultiChannelNode;
      if (this.getStoreValue('initialized') !== true) {
        if (this.switchDetached) {
          for (const inputChannel of this.switchChannels) {
            const zwaveDetachedModeRaw = await this.configurationGet({index: 6 + inputChannel});
            const zwaveDetachedModeArray = Array.from(zwaveDetachedModeRaw['Configuration Value']);
            const zwaveDetachedMode = zwaveDetachedModeArray[0];
            const capability = `input_${inputChannel}`;

            if (Number(zwaveDetachedMode) === 1) {
              if (!this.hasCapability(capability)) {
                await this.addCapability(capability).catch(this.error);
              }
            } else {
              if (this.hasCapability(capability)) {
                await this.removeCapability(capability).catch(this.error);
              }
            }
          }
        }
        await this.firstInitConfigureDevice(mainNode);
        await this.setStoreValue('initialized', true).catch(this.error);
      }

      // Let the device configure itself
      await this.configureDevice(mainNode);

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

  async onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    this.log('Updating settings:', JSON.stringify(changedKeys), JSON.stringify(newSettings));

    if (this.switchDetached) {
      for (const inputChannel of this.switchChannels) {
        const capability = `input_${inputChannel}`;
        if (changedKeys.includes(`zwaveOutputDetached${inputChannel}`)) {
          if (Number(newSettings[`zwaveOutputDetached${inputChannel}`]) === 1) {
            if (!this.hasCapability(capability)) {
              await this.addCapability(capability);
            }
          } else {
            if (this.hasCapability(capability)) {
              await this.removeCapability(capability);
            }
          }
        }
      }
    }
    return super.onSettings({oldSettings, newSettings, changedKeys});
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    const result: ShellyActionEvent[] = [];

    for (const input of this.switchChannels) {
      // The available events depend on the button settings, they need to be momentary and detached for this to work
      if (
        this.getSetting(`zwaveSwitchTypeSW${input}`) == 0 &&
        (this.switchDetached ? (this.getSetting(`zwaveOutputDetached${input}`) == 1) : true)
      ) {
        result.push(`single_push_${input}`, `double_push_${input}`, `long_push_${input}`, `released_${input}`);
      }
    }

    return result;
  }

  /** Use this method to configure the device specific capabilities */
  protected abstract configureDevice(isMainNode: boolean): Promise<void>;

  /** Use this method to configure anything that needs to be configured at first initialization */
  protected async firstInitConfigureDevice(isMainNode: boolean): Promise<void> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // To override
  }

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

  protected initializeButtonScenes(): void {
    this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', notification => {
      try {
        const button = notification['Scene Number'];
        const action = notification['Properties1']['Key Attributes'];

        const parsedAction = {
          action: convertIncomingActionEvent(action, 'zwave') + `_${button}`,
        };

        this.homey.flow.getDeviceTriggerCard('triggerActionEvent')
          .trigger(this, parsedAction, parsedAction)
          .catch(this.error);

      } catch (e) {
        this.error('Failed parsing scene notification', JSON.stringify(notification), e);
      }
    });
  }
}
