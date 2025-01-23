import ShellyDriver from './ShellyDriver';

let deviceCount = 0;
let deviceInitialisedCount = 0;

export default abstract class ShellyZwaveDriver extends ShellyDriver {
  /** Request a timeout to gradually bring up the Z-Wave devices */
  public getStartupTimeout(): number {
    deviceCount++;

    return (deviceCount - deviceInitialisedCount) * 1000;
  }

  public markInitialized(): void {
    deviceInitialisedCount++;
  }
}
