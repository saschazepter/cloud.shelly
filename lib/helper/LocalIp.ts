import Homey from 'homey';
import type HomeyType from 'homey/lib/Homey';

let lastLoggedIp: string = '';

export async function getIp(homey: HomeyType): Promise<string> {
  let ip;
  if (Homey.env.HOMEY_IP) {
    ip = Homey.env.HOMEY_IP;
  } else {
    ip = await homey.cloud.getLocalAddress();
    // Homey adds a port, so remove that
    // Old implement was always removing the last three characters, so keep using that for now
    ip = ip.slice(0, -3);
  }

  if (lastLoggedIp !== ip) {
    // todo: use reference to ShellyApp when converted to Typescript
    (homey.app as any).debug('Using local IP', ip);
    lastLoggedIp = ip;
  }

  return ip;
}
