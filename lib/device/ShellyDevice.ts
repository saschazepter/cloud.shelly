import {Device} from 'homey';
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

  public log(...args: any[]): void {
    this.logger ? this.logger.log(...args) : super.log(...args);
  }

  public error(...args: any[]): void {
    this.logger ? this.logger.error(...args) : super.error(...args);
  }

  public debug(...args: any[]): void {
    this.logger?.debug(...args);
  }
}
