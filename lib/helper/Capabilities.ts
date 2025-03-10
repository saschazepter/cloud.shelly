import type {Device} from 'homey';

export async function addCapabilityIfNotExists(device: Device, capability: string): Promise<void> {
  if (device.hasCapability(capability)) {
    return;
  }

  await device.addCapability(capability);
}

export async function removeCapabilityIfAvailable(device: Device, capability: string): Promise<void> {
  if (!device.hasCapability(capability)) {
    return;
  }

  await device.removeCapability(capability);
}
