import 'homey';

declare module 'homey' {
  export class ZwaveCommandClass extends SimpleClass {
    version: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [command: string]: (...args: unknown[]) => Promise<any>;
  }
}
