import {Device} from 'homey';
import type ShellyDriver from '../driver/ShellyDriver';
import type {ShellyActionEvent} from '../flow/trigger/ActionEventTrigger';
import Logger from '../log/Logger';

export interface ShellyDeviceInterface {
  getPossibleActionEvents(): ShellyActionEvent[];
}

export default abstract class ShellyDevice extends Device implements ShellyDeviceInterface {
  protected logger?: Logger = undefined;

  public abstract getPossibleActionEvents(): ShellyActionEvent[];

  public async onInit(): Promise<void> {
    this.logger = new Logger(this, super.log, super.error);
    return super.onInit();
  }

  onSettings({oldSettings, newSettings, changedKeys}: {
    oldSettings: { [p: string]: boolean | string | number | undefined | null };
    newSettings: { [p: string]: boolean | string | number | undefined | null };
    changedKeys: string[]
  }): Promise<string | void> {
    this.log('Updating settings:', JSON.stringify(changedKeys), JSON.stringify(newSettings));
    return super.onSettings({oldSettings, newSettings, changedKeys});
  }

  protected getDriver(): ShellyDriver {
    return this.driver as ShellyDriver;
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
