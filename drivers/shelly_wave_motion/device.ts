import ShellyZwaveDevice from "../../lib/device/zwave/ShellyZwaveDevice";
import {type ShellyActionEvent} from "../../lib/flow/trigger/ActionEventTrigger";
import {NotificationReport} from "../../types/zwave/NotificationReport";

module.exports = class ShellyWaveMotionDevice extends ShellyZwaveDevice
{
  protected async configureDevice(): Promise<void> {
    this.registerCapability('measure_battery', 'BATTERY');

    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');

    await this.setCapabilityValue('alarm_presence', false).catch(this.error);

    this.registerReportListener('NOTIFICATION', 'NOTIFICATION_REPORT', async (report: NotificationReport) => {
      if (report["Notification Type"] === 'Home Security') {
        if (report['Event (Parsed)'] === "Motion Detection") {
          this.log('Presence detected');
          await this.setCapabilityValue('alarm_presence', true).catch(this.error);
        } else if (report['Event (Parsed)'] === "Event inactive") {
          this.log('Presence no longer detected');
          await this.setCapabilityValue('alarm_presence', false).catch(this.error);
        }
      }
    });
  }

  public getPossibleActionEvents(): ShellyActionEvent[] {
    // No action events for this device
    return [];
  }
};
