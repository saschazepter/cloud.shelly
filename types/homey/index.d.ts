import 'homey';

declare module 'homey' {
  export class ZwaveCommandClass extends SimpleClass {
    version: any;
    [command: string]: (...args: any[]) => Promise<any>;
  }
}
