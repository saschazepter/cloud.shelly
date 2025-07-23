export type NotificationReport = {
  "V1 Alarm Type (Raw)": Buffer,
  "V1 Alarm Type": number,
  "V1 Alarm Level (Raw)": Buffer,
  "V1 Alarm Level": number,
  "Notification Status (Raw)": Buffer,
  "Notification Status": string,
  "Notification Type (Raw)": Buffer,
  "Notification Type": string,
  "Event (Raw)": Buffer,
  "Event": number,
  "Properties1 (Raw)": Buffer,
  "Properties1": {
    "Event Parameters Length": number,
    "Sequence": boolean
  },
  "Event Parameter (Raw)": Buffer,
  "Event Parameter": Buffer,
  "Event (Parsed)": string
}
