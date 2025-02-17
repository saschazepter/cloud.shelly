import {Driver} from 'homey';
import Logger from '../log/Logger';

export default abstract class ShellyDriver extends Driver {
  protected logger?: Logger = undefined;

  public async onInit(): Promise<void> {
    this.logger = new Logger(this, super.log, super.error);
    return super.onInit();
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
