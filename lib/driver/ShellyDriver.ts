import {Driver} from 'homey';
import Logger from '../log/Logger';

export default abstract class ShellyDriver extends Driver {
  protected logger?: Logger = undefined;

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
